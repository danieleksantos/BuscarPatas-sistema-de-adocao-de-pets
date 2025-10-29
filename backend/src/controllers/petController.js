import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

const prisma = new PrismaClient();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null);
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'buscar_patas', resource_type: 'image' },
            (error, result) => {
                if (error) { reject(error); } else { resolve(result); }
            }
        );
        readableStream.pipe(uploadStream);
    });
};

export const createPet = async (req, res) => {
    try {
        const { nome, especie, data_nascimento, descricao, status, tamanho, personalidade, sexo } = req.body;
        let imageUrl = null;

        if (req.file) { 
            try {
                const result = await uploadToCloudinary(req.file.buffer);
                imageUrl = result.secure_url; 
            } catch (uploadError) {
                console.error('Erro no upload para o Cloudinary:', uploadError);
            }
        } 

        const dadosCriacao = {
            nome: nome ? nome.toLowerCase() : undefined,
            especie: especie ? especie.toLowerCase() : undefined,
            descricao: descricao ? descricao.toLowerCase() : undefined,
            data_nascimento: data_nascimento ? new Date(data_nascimento) : null,
            imagem_url1: imageUrl,
        };

        if (sexo) {
            const sexoTratado = sexo.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (['MACHO', 'FEMEA'].includes(sexoTratado)) {
                dadosCriacao.sexo = sexoTratado;
            } else {
                return res.status(400).json({ error: 'Sexo inválido. Deve ser MACHO ou FEMEA.' });
            }
        } else {
            return res.status(400).json({ error: 'O campo sexo é obrigatório.' });
        }
        
        if (status) dadosCriacao.status = status.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (tamanho) dadosCriacao.tamanho = tamanho.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (personalidade) dadosCriacao.personalidade = personalidade.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        const novoPet = await prisma.pet.create({
            data: dadosCriacao,
        });

        res.status(201).json(novoPet);
    } catch (error) {
        console.error('Erro ao cadastrar pet:', error);
        if (error.code && error.code.startsWith('P')) { 
            return res.status(400).json({ error: 'Dados inválidos para cadastro do pet. Verifique os campos obrigatórios.' });
        }
        res.status(500).json({ error: 'Não foi possível cadastrar o pet.' });
    }
};

export const getAllPets = async (req, res) => {
    try {
        const { nome, especie, status, tamanho, personalidade, sexo, page = 1, limit = 10 } = req.query;
        const pageAsNumber = parseInt(page);
        const limitAsNumber = parseInt(limit);
        const where = {};

        if (nome) { where.nome = { contains: nome, mode: 'insensitive' }; }
        if (especie) { where.especie = { equals: especie, mode: 'insensitive' }; }
        if (status) { where.status = status; }
        if (tamanho) { where.tamanho = tamanho; }
        if (personalidade) { where.personalidade = personalidade; }
        
        if (sexo) { 
            const sexoTratado = sexo.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (['MACHO', 'FEMEA'].includes(sexoTratado)) {
                where.sexo = sexoTratado; 
            }
        }

        const pets = await prisma.pet.findMany({
            where: where,
            skip: (pageAsNumber - 1) * limitAsNumber,
            take: limitAsNumber,
            orderBy: { 
                pet_id: 'desc' 
            }
        });
        
        const totalPets = await prisma.pet.count({ where: where });

        res.status(200).json({
            data: pets,
            pagination: {
                total: totalPets, page: pageAsNumber , limit: limitAsNumber,
                totalPages: Math.ceil(totalPets / limitAsNumber),
            },
        });
    } catch (error) {
        console.error('Erro ao listar pets:', error); 
        res.status(500).json({ error: 'Não foi possível listar os pets.' });
    }
};

export const getAllAvailablePets = async (req, res) => {
    try {
        const petsDisponiveis = await prisma.pet.findMany({
            where: { status: 'DISPONIVEL' },
            orderBy: { nome: 'asc' } 
        });
        res.status(200).json(petsDisponiveis);
    } catch (error) {
        console.error('Erro ao listar pets disponíveis:', error);
        res.status(500).json({ error: 'Não foi possível listar os pets disponíveis.' });
    }
};

export const getDistinctEspecies = async (req, res) => {
    try {
        const pets = await prisma.pet.findMany({
            distinct: ['especie'],
            select: { especie: true },
            orderBy: { especie: 'asc' },
        });
        const especiesUpperCase = pets
            .map((pet) => pet.especie?.toUpperCase()) 
            .filter(Boolean); 
        const uniqueEspecies = [...new Set(especiesUpperCase)];
        res.status(200).json(uniqueEspecies);
    } catch (error) {
        console.error('Erro ao buscar espécies:', error);
        res.status(500).json({ error: 'Não foi possível buscar as espécies.' });
    }
};

export const getAllAdoptedPets = async (req, res) => {
    try {
        const petsAdotados = await prisma.pet.findMany({
            where: { status: 'ADOTADO' },
        });
        res.status(200).json(petsAdotados);
    } catch (error) {
        console.error('Erro ao listar pets adotados:', error);
        res.status(500).json({ error: 'Não foi possível listar os pets adotados.' });
    }
};

export const updatePet = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, especie, data_nascimento, descricao, status, tamanho, personalidade, sexo } = req.body;
        let imageUrl = null; 

        if (req.file) {
            try {
                const result = await uploadToCloudinary(req.file.buffer);
                imageUrl = result.secure_url; 
            } catch (uploadError) {
                console.error('Erro no upload da nova imagem:', uploadError);
                return res.status(500).json({ error: 'Falha ao fazer o upload da nova imagem.' });
            }
        } 

        const dadosParaAtualizar = {};
        if (nome != null) dadosParaAtualizar.nome = nome.toLowerCase(); 
        if (especie != null) dadosParaAtualizar.especie = especie.toLowerCase(); 
        if (data_nascimento !== undefined) { 
            dadosParaAtualizar.data_nascimento = data_nascimento ? new Date(data_nascimento) : null;
        }
        if (descricao != null) dadosParaAtualizar.descricao = descricao.toLowerCase(); 
        
        if (imageUrl) {
            dadosParaAtualizar.imagem_url1 = imageUrl;
        } 
        
        if (sexo) {
            const sexoTratado = sexo.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (['MACHO', 'FEMEA'].includes(sexoTratado)) {
                dadosParaAtualizar.sexo = sexoTratado; 
            } else { 
                return res.status(400).json({ error: 'Sexo inválido. Deve ser MACHO ou FEMEA.' }); 
            }
        }

        if (status) {
            const statusTratado = status.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (['DISPONIVEL', 'ADOTADO'].includes(statusTratado)) { dadosParaAtualizar.status = statusTratado; } 
            else { return res.status(400).json({ error: 'Status inválido.' }); }
        }
        if (tamanho) {
            const tamanhoTratado = tamanho.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (['PEQUENO', 'MEDIO', 'GRANDE'].includes(tamanhoTratado)) { dadosParaAtualizar.tamanho = tamanhoTratado; }
            else { return res.status(400).json({ error: 'Tamanho inválido.' }); }
        }
        if (personalidade) {
            const persTratada = personalidade.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (['CALMO', 'BRINCALHAO', 'INDEPENDENTE'].includes(persTratada)) { dadosParaAtualizar.personalidade = persTratada; }
            else { return res.status(400).json({ error: 'Personalidade inválida.' }); }
        }

        if (Object.keys(dadosParaAtualizar).length === 0) {
            const petAtual = await prisma.pet.findUnique({ where: { pet_id: parseInt(id) } });
            if (!petAtual) return res.status(404).json({ error: 'Pet não encontrado.' });
            return res.status(200).json(petAtual); 
        }

        const petAtualizado = await prisma.pet.update({
            where: { pet_id: parseInt(id) }, 
            data: dadosParaAtualizar, 
        });

        res.status(200).json(petAtualizado);
    } catch (error) {
        console.error('Erro ao atualizar pet:', error); 
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Pet não encontrado para atualização.' });
        }
        if (error.code && error.code.startsWith('P')) {
            return res.status(400).json({ error: 'Dados inválidos para atualização do pet.' });
        }
        res.status(500).json({ error: 'Não foi possível atualizar o pet.' });
    }
};

export const deletePet = async (req, res) => {
    try {
        const { id } = req.params;

        const adocaoExistente = await prisma.adocao.findFirst({
            where: { pet_id: parseInt(id) },
        });

        if (adocaoExistente) {
            return res.status(409).json({ 
                error: 'Este pet não pode ser excluído pois já possui um registro de adoção.',
            });
        }
        
        await prisma.pet.delete({
            where: { pet_id: parseInt(id) }, 
        });

        res.status(204).send(); 
    } catch (error) {
        console.error('Erro ao deletar pet:', error);
        if (error.code === 'P2025') { 
            return res.status(404).json({ error: 'Pet não encontrado.' });
        }
        res.status(500).json({ error: 'Não foi possível remover o pet.' });
    }
};