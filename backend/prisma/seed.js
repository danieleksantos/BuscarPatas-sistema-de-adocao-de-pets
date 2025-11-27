import { PrismaClient, Sexo, TamanhoPet, PersonalidadePet } from '@prisma/client';

import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function getSexoFromNome(nome) {
  const nomesFemininos = ['Luna', 'Penny', 'Amora', 'Mia', 'Lola', 'Bella', 'Lucy', 'Daisy', 'Milo', 'Zoe', 'Cleo', 'Lily', 'Nala', 'Chloe', 'Ruby', 'Pipoca'];
  
  const isFeminino = nomesFemininos.some(n => nome.toLowerCase() === n.toLowerCase());

  return isFeminino ? Sexo.FEMEA : Sexo.MACHO;
}


async function main() {
  console.log('Iniciando o processo de seeding (apenas inserindo o que não existe)...');

  const adminEmail = "buscarpatas@gmail.com";
  const adminPassword = "senha_123";
  const adminName = "Admin do Abrigo";

  const existingAdminAuth = await prisma.auth.findUnique({
    where: { email: adminEmail },
    include: { adotante: true }
  });

  let createdAdminAuth;

  if (existingAdminAuth) {
    createdAdminAuth = existingAdminAuth;
    console.log(`Usuário Admin já existe. E-mail: ${adminEmail} (ID: ${existingAdminAuth.auth_id})`);
  } else {
    const hashedPasswordAdmin = await bcrypt.hash(adminPassword, 10);

    createdAdminAuth = await prisma.auth.create({
      data: {
        email: adminEmail,
        senha: hashedPasswordAdmin,
        role: 'ADMIN',
        adotante: {
          create: {
            nome: adminName,
            telefone: "00000000000",
            rua: "Não Aplicável",
            numero: "0",
            bairro: "Não Aplicável",
            cidade: "Não Aplicável",
            uf: "NA",
          }
        }
      },
    });
    console.log(`Usuário Admin criado com sucesso! E-mail: ${adminEmail} (ID: ${createdAdminAuth.auth_id})`);
  }

  const senhaPadrao = await bcrypt.hash('senha_123', 10);

  const usersData = [
    { email: "mariana.costa@example.com", nome: "Mariana Costa", telefone: "11988776655", cep: "01311-100", rua: "Avenida Paulista", numero: "2000", bairro: "Bela Vista", cidade: "São Paulo", uf: "SP" },
    { email: "ricardo.a@example.com", nome: "Ricardo Almeida", telefone: "71911223344", cep: "40020-000", rua: "Rua das Laranjeiras", numero: "50", bairro: "Pelourinho", cidade: "Salvador", uf: "BA" },
    { email: "fer.oliveira@example.com", nome: "Fernanda Oliveira", telefone: "48999887766", cep: "88010-000", rua: "Avenida Beira Mar Norte", numero: "1200", bairro: "Centro", cidade: "Florianópolis", uf: "SC" },
    { email: "lucas.pereira@example.com", nome: "Lucas Pereira", telefone: "61981234567", cep: "70040-900", rua: "SQS 308 Bloco C", numero: "101", bairro: "Asa Sul", cidade: "Brasília", uf: "DF" },
    { email: "juliana.s@example.com", nome: "Juliana Santos", telefone: "92992345678", cep: "69010-000", rua: "Rua Tapajós", numero: "45", bairro: "Centro", cidade: "Manaus", uf: "AM" },
    { email: "pedro.gomes@example.com", nome: "Pedro Gomes", telefone: "21977665544", cep: "22410-001", rua: "Rua Nascimento Silva", numero: "340", bairro: "Ipanema", cidade: "Rio de Janeiro", uf: "RJ" },
    { email: "carla.rocha@example.com", nome: "Carla Rocha", telefone: "81966554433", cep: "51020-000", rua: "Avenida Boa Viagem", numero: "150", bairro: "Boa Viagem", cidade: "Recife", uf: "PE" },
    { email: "marcos.lima@example.com", nome: "Marcos Lima", telefone: "31955443322", cep: "30140-001", rua: "Rua Contorno", numero: "888", bairro: "Funcionários", cidade: "Belo Horizonte", uf: "MG" },
    { email: "patricia.m@example.com", nome: "Patrícia Menezes", telefone: "51944332211", cep: "90570-001", rua: "Rua 24 de Outubro", numero: "90", bairro: "Moinhos de Vento", cidade: "Porto Alegre", uf: "RS" }
  ];

  let newAdotantesCount = 0;
  for (const userData of usersData) {
    const existingUser = await prisma.auth.findUnique({
      where: { email: userData.email },
    });

    if (!existingUser) {
      await prisma.auth.create({
        data: {
          email: userData.email,
          senha: senhaPadrao,
          adotante: {
            create: {
              nome: userData.nome,
              telefone: userData.telefone,
              cep: userData.cep || null, 
              rua: userData.rua,
              numero: userData.numero,
              bairro: userData.bairro,
              cidade: userData.cidade,
              uf: userData.uf,
            },
          },
        },
      });
      newAdotantesCount++;
    }
  }
  console.log(`${newAdotantesCount} novos Adotantes/Autenticações (de teste) criados. Os restantes já existiam.`);


 const rawPetData = [
    { nome: "Fred", especie: "Cachorro", data_nascimento: new Date("2023-08-10"), descricao: "Fred é um cachorro cheio de energia! Ele adora correr, buscar a bolinha e está sempre pronto para a próxima aventura.", tamanho: TamanhoPet.MEDIO, personalidade: PersonalidadePet.BRINCALHAO, imagem_url1: "https://img.freepik.com/fotos-premium/o-cachorro-branco-dorme-na-mesa-em-frente-ao-laptop-o-conceito-de-trabalhar-em-casa-treinando-um-trabalhador-cansado_330478-1569.jpg?w=740" },
 ]
  
  const petData = rawPetData.map(pet => ({
    ...pet,
    sexo: getSexoFromNome(pet.nome),
  }));


  const petNames = petData.map(p => p.nome);
  const existingPets = await prisma.pet.findMany({
    where: {
      nome: {
        in: petNames,
      },
    },
    select: {
      nome: true,
    },
  });

  const existingPetNames = new Set(existingPets.map(p => p.nome));

  const petsToCreate = petData.filter(p => !existingPetNames.has(p.nome));

  if (petsToCreate.length > 0) {
    await prisma.pet.createMany({ 
      data: petsToCreate,
    });
  }

  console.log(`${petsToCreate.length} novos pets criados.`);

  const adotantes = await prisma.adotante.findMany();
  const pets = await prisma.pet.findMany();

  const adotanteMap = new Map();
  adotantes.forEach(a => adotanteMap.set(a.nome, a));

  const petMap = new Map();
  pets.forEach(p => petMap.set(p.nome, p));


  const adocoesData = [
    { adotanteNome: "Mariana Costa", petNome: "Fred" },
    { adotanteNome: "Lucas Pereira", petNome: "Luna" },
    { adotanteNome: "Pedro Gomes", petNome: "Zeca" },
    { adotanteNome: "Carla Rocha", petNome: "Amora" },
    { adotanteNome: "Marcos Lima", petNome: "Toby" },
    { adotanteNome: "Patrícia Menezes", petNome: "Nino" },
    { adotanteNome: "Juliana Santos", petNome: "Rocky" },
  ];

  let newAdoptionsCount = 0;
  for (const adocao of adocoesData) {
    const adotante = adotanteMap.get(adocao.adotanteNome);
    const pet = petMap.get(adocao.petNome);

    if (adotante && pet) {
      const existingAdocao = await prisma.adocao.findFirst({
        where: {
          adotante_id: adotante.adotante_id,
          pet_id: pet.pet_id,
        },
      });

      if (!existingAdocao) {
        await prisma.adocao.create({
          data: {
            adotante_id: adotante.adotante_id,
            pet_id: pet.pet_id,
          }
        });

        await prisma.pet.update({
          where: { pet_id: pet.pet_id },
          data: { status: 'ADOTADO' }
        });

        newAdoptionsCount++;
        console.log(`Nova Adoção realizada: ${adotante.nome} e ${pet.nome}.`);
      } else {
        if (pet.status !== 'ADOTADO') {
          await prisma.pet.update({
            where: { pet_id: pet.pet_id },
            data: { status: 'ADOTADO' }
          });
          console.log(`Status do Pet ${pet.nome} atualizado para ADOTADO.`);
        }
      }
    } else {
      console.warn(`[AVISO] Não foi possível encontrar Adotante (${adocao.adotanteNome}) ou Pet (${adocao.petNome}) para criar a adoção.`);
    }
  }

  console.log(`${newAdoptionsCount} novas adoções criadas.`);
  console.log('Seeding finalizado com sucesso! 🐾');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });