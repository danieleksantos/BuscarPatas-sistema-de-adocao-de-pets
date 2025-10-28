import { prisma } from '../config/prisma.js';

const fetchAllCounts = async () => {
    const totalPets = await prisma.pet.count();
    
    // Contagem de usuários com papel 'USER' (adotantes)
    const totalAdotantes = await prisma.auth.count({
        where: {
            role: 'USER', 
        },
    });

    // Contagem de adoções (pets adotados)
    const petsAdotados = await prisma.adocao.count(); 
    

    return {
        totalPets,
        totalAdotantes,
        petsAdotados,
    };
};

export const getDashboardCounts = async (req, res) => {
    try {
        const counts = await fetchAllCounts();

        res.status(200).json({
            totalPets: counts.totalPets,
            totalAdotantes: counts.totalAdotantes,
            petsAdotados: counts.petsAdotados,
        });

    } catch (error) {
        console.error('Erro ao buscar contagens do dashboard (Admin):', error);
        res.status(500).json({ error: 'Erro interno do servidor ao buscar dados.' });
    }
};

// ENDPOINT PÚBLICO: Retorna apenas a contagem de adoções
export const getPublicAdoptionCount = async (req, res) => {
    try {
        const petsAdotados = await prisma.adocao.count(); 

        res.status(200).json({
            petsAdotados: petsAdotados,
        });
        
    } catch (error) {
        console.error('Erro ao buscar contagem pública de adoções:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao buscar contagens públicas.' });
    }
};