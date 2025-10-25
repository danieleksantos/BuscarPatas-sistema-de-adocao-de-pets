import { prisma } from '../config/prisma.js';


// READ (Listar todos - MODIFICADO)
export const getAllAdotantes = async (req, res) => {
  try {
    const adotantes = await prisma.adotante.findMany({
      orderBy: {
        nome: 'asc', // Ordena alfabeticamente pelo nome
      },
      include: {
        auth: { // Inclui os dados da tabela Auth
          select: {
            email: true,
            role: true,
          },
        },
      },
    });

    // Combina os dados de auth com o objeto principal do adotante para facilitar no frontend
    const resultado = adotantes.map(adotante => ({
      ...adotante,
      email: adotante.auth.email,
      role: adotante.auth.role,
    }));

    res.status(200).json(resultado);
  } catch (error)
 {
    console.error(error);
    res.status(500).json({ error: 'Não foi possível listar os adotantes.' });
  }
};

// READ (Listar adotantes que ainda não adotaram)
export const getAdotantesSemAdocao = async (req, res) => {
  try {
    const adotantes = await prisma.adotante.findMany({
      where: {
        adocoes: {
          none: {},
        },
      },
      include: { 
        auth: {
          select: { email: true, role: true }
        }
      }
    });

    const resultado = adotantes.map(adotante => ({
      ...adotante,
      email: adotante.auth.email,
      role: adotante.auth.role,
    }));

    res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Não foi possível listar os adotantes.' });
  }
};

// UPDATE 
export const updateAdotante = async (req, res) => {
  try {
    const { id } = req.params;
    // Apenas 'role' é enviado para a mudança de permissão
    const { nome, email, telefone, rua, numero, bairro, cidade, uf, role } = req.body;

    const adotante = await prisma.adotante.findUnique({ where: { adotante_id: parseInt(id) } });
    if (!adotante) {
      return res.status(404).json({ error: 'Adotante não encontrado.' });
    }

    // Se a requisição contiver dados de perfil (nome, email, etc.)
    const dadosPerfil = {};
    if (nome) dadosPerfil.nome = nome;
    if (rua) dadosPerfil.rua = rua;
    if (numero) dadosPerfil.numero = numero;
    if (bairro) dadosPerfil.bairro = bairro;
    if (cidade) dadosPerfil.cidade = cidade;
    if (uf) dadosPerfil.uf = uf.toUpperCase();
    if (telefone) dadosPerfil.telefone = telefone.replace(/\D/g, '');

    if (Object.keys(dadosPerfil).length > 0) {
      await prisma.adotante.update({
        where: { adotante_id: parseInt(id) },
        data: dadosPerfil,
      });
    }

    // Se a requisição contiver role ou email, atualiza a tabela Auth
    const dadosAuth = {};
    if (email) dadosAuth.email = email;
    if (role && (role === 'ADMIN' || role === 'USER')) {
      dadosAuth.role = role;
    }
    
    if (Object.keys(dadosAuth).length > 0) {
      await prisma.auth.update({
        where: { auth_id: adotante.auth_id },
        data: dadosAuth,
      });
    }

    // Retorna o adotante completamente atualizado
    const adotanteAtualizado = await prisma.adotante.findUnique({
      where: { adotante_id: parseInt(id) },
      include: { auth: { select: { email: true, role: true } } }
    });
    
    const resultado = {
      ...adotanteAtualizado,
      email: adotanteAtualizado.auth.email,
      role: adotanteAtualizado.auth.role,
    };

    res.status(200).json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Não foi possível atualizar o adotante.' });
  }
};

// DELETE 
export const deleteAdotante = async (req, res) => {
  try {
    const { id } = req.params;
    const adotante_id = parseInt(id);

    const adocoesDoAdotante = await prisma.adocao.count({
      where: { adotante_id },
    });
    if (adocoesDoAdotante > 0) {
      return res.status(409).json({
        error: 'Este adotante não pode ser excluído pois possui adoções registradas.'
      });
    }

    const adotante = await prisma.adotante.findUnique({
      where: { adotante_id },
    });
    if (!adotante) {
      return res.status(404).json({ error: 'Adotante não encontrado.' });
    }

    // Usa uma transação para deletar o Adotante e o Auth associado
    await prisma.$transaction([
      prisma.adotante.delete({ where: { adotante_id } }),
      prisma.auth.delete({ where: { auth_id: adotante.auth_id } })
    ]);

    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Adotante não encontrado.' });
    }
    console.error(error);
    res.status(500).json({ error: 'Não foi possível remover o adotante.' });
  }
};