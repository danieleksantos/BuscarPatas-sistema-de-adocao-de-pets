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
    { email: "mariana.c@example.com", nome: "Mariana Costa", telefone: "11988776655", cep: "01311-100", rua: "Avenida Paulista", numero: "2000", bairro: "Bela Vista", cidade: "São Paulo", uf: "SP" },
    { email: "ricardo.a@example.com", nome: "Ricardo Alves", telefone: "71911223344", cep: "40020-000", rua: "Rua das Laranjeiras", numero: "50", bairro: "Pelourinho", cidade: "Salvador", uf: "BA" },
    { email: "fer.ol@example.com", nome: "Fernanda Oliveira", telefone: "48999887766", cep: "88010-000", rua: "Avenida Beira Mar Norte", numero: "1200", bairro: "Centro", cidade: "Florianópolis", uf: "SC" },
    { email: "lucas.p@example.com", nome: "Lucas Pereira", telefone: "61981234567", cep: "70040-900", rua: "SQS 308 Bloco C", numero: "101", bairro: "Asa Sul", cidade: "Brasília", uf: "DF" },
    { email: "juliana.s@example.com", nome: "Juliana Santos", telefone: "92992345678", cep: "69010-000", rua: "Rua Tapajós", numero: "45", bairro: "Centro", cidade: "Manaus", uf: "AM" },
    { email: "pedro.g@example.com", nome: "Pedro Gomes", telefone: "21977665544", cep: "22410-001", rua: "Rua Nascimento Silva", numero: "340", bairro: "Ipanema", cidade: "Rio de Janeiro", uf: "RJ" },
    { email: "carla.r@example.com", nome: "Carla Rocha", telefone: "81966554433", cep: "51020-000", rua: "Avenida Boa Viagem", numero: "150", bairro: "Boa Viagem", cidade: "Recife", uf: "PE" },
    { email: "marcos@example.com", nome: "Marcos Lima", telefone: "31955443322", cep: "30140-001", rua: "Rua Contorno", numero: "888", bairro: "Funcionários", cidade: "Belo Horizonte", uf: "MG" },
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

    { nome: "Luna", especie: "Gato", data_nascimento: new Date("2022-04-01"), descricao: "Luna é uma gata serena. Ela aprecia cochilos longos em lugares quentinhos e é uma companheira muito tranquila.", tamanho: TamanhoPet.PEQUENO, personalidade: PersonalidadePet.CALMO, imagem_url1: "https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=436" },

    { nome: "Zeca", especie: "Pássaro", data_nascimento: new Date("2020-01-20"), descricao: "Zeca é um pássaro muito animado. Ele adora interagir, cantar e é muito sociável com quem está por perto.", tamanho: TamanhoPet.PEQUENO, personalidade: PersonalidadePet.BRINCALHAO, imagem_url1: "https://images.unsplash.com/photo-1685388463626-68e8011f2058?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870" },

    { nome: "Penny", especie: "Porquinho da India", data_nascimento: new Date("2022-04-08"), descricao: "Penny é um porquinho da Índia calmo e dócil. Ela é carinhosa e adora passar o tempo mastigando seus petiscos favoritos.", tamanho: TamanhoPet.MEDIO, personalidade: PersonalidadePet.CALMO, imagem_url1: "https://plus.unsplash.com/premium_photo-1664300277972-b9a0db2e1b2e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=872" },

    { nome: "Amora", especie: "Cachorro", data_nascimento: new Date("2019-12-25"), descricao: "Amora é uma cadela calma e obediente. Ela adora descansar na grama e é perfeita para um lar que busca tranquilidade.", tamanho: TamanhoPet.GRANDE, personalidade: PersonalidadePet.CALMO, imagem_url1: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870" },

    { nome: "Nino", especie: "Gato", data_nascimento: new Date("2024-05-15"), descricao: "Nino é um gato curioso e independente. Ele gosta de explorar o ambiente sozinho e tem uma natureza aventureira.", tamanho: TamanhoPet.PEQUENO, personalidade: PersonalidadePet.INDEPENDENTE, imagem_url1: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=436" },

    { nome: "Toby", especie: "Cachorro", data_nascimento: new Date("2022-02-14"), descricao: "Toby é um cachorro brincalhão. Ele tem um faro impecável e se diverte muito farejando e correndo em campos abertos.", tamanho: TamanhoPet.MEDIO, personalidade: PersonalidadePet.BRINCALHAO, imagem_url1: "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=386" },

    { nome: "Mia", especie: "Gato", data_nascimento: new Date("2021-09-30"), descricao: "Mia é uma gata muito afetuosa. Ela adora colo, é muito relaxada e busca sempre um ambiente confortável para se aconchegar.", tamanho: TamanhoPet.PEQUENO, personalidade: PersonalidadePet.CALMO, imagem_url1: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870" },

    { nome: "Rocky", especie: "Cachorro", data_nascimento: new Date("2020-07-22"), descricao: "Rocky é um cachorro leal e com um temperamento equilibrado. Ele é um ótimo companheiro, com uma presença imponente e calma.", tamanho: TamanhoPet.GRANDE, personalidade: PersonalidadePet.CALMO, imagem_url1: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870" },

    { nome: "Simba", especie: "Gato", data_nascimento: new Date("2023-01-05"), descricao: "Simba é um gato muito ativo. Ele está sempre alerta, adora caçar bolinhas de papel e tem uma personalidade divertida.", tamanho: TamanhoPet.PEQUENO, personalidade: PersonalidadePet.BRINCALHAO, imagem_url1: "https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=436" },

    { nome: "Lola", especie: "Cachorro", data_nascimento: new Date("2023-11-11"), descricao: "Lola é uma cachorra esperta e divertida. Ela é fácil de treinar e adora exibir sua elegância enquanto brinca.", tamanho: TamanhoPet.PEQUENO, personalidade: PersonalidadePet.BRINCALHAO, imagem_url1: "https://images.unsplash.com/photo-1625316708582-7c38734be31d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387" },

    { nome: "Oliver", especie: "Gato", data_nascimento: new Date("2018-06-18"), descricao: "Oliver é um gato experiente e muito reservado. Ele é ideal para quem busca um pet que se contenta em ter o seu próprio espaço.", tamanho: TamanhoPet.MEDIO, personalidade: PersonalidadePet.INDEPENDENTE, imagem_url1: "https://images.unsplash.com/photo-1506755855567-92ff770e8d00?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387" },

    { nome: "Max", especie: "Cachorro", data_nascimento: new Date("2021-03-25"), descricao: "Max é um cão amigável e cheio de alegria. Ele está sempre pronto para passear e fazer novos amigos.", tamanho: TamanhoPet.GRANDE, personalidade: PersonalidadePet.BRINCALHAO, imagem_url1: "https://plus.unsplash.com/premium_photo-1676389281733-aaefab0e7907?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=386" },

    { nome: "Bella", especie: "Cachorro", data_nascimento: new Date("2024-02-01"), descricao: "Bella é uma filhote muito calma. Ela adora dormir no colo e é a definição de aconchego para o seu futuro lar.", tamanho: TamanhoPet.PEQUENO, personalidade: PersonalidadePet.CALMO, imagem_url1: "https://images.unsplash.com/photo-1504826260979-242151ee45b7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387" },

    { nome: "Charlie", especie: "Cachorro", data_nascimento: new Date("2019-08-19"), descricao: "Charlie é um cachorro tranquilo e carinhoso, apesar de um pouco teimoso. Ele é um ótimo companheiro de sofá.", tamanho: TamanhoPet.PEQUENO, personalidade: PersonalidadePet.CALMO, imagem_url1: "https://images.unsplash.com/photo-1741610609941-93cddf05b88d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=327" },

    { nome: "Lucy", especie: "Cachorro", data_nascimento: new Date("2022-10-09"), descricao: "Lucy é uma cachorra ativa e cheia de vida. Ela é uma companheira fiel que adora correr e brincar ao ar livre.", tamanho: TamanhoPet.MEDIO, personalidade: PersonalidadePet.BRINCALHAO, imagem_url1: "https://plus.unsplash.com/premium_photo-1677542200636-87e4f3f5e3eb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=386" },

    { nome: "Leo", especie: "Gato", data_nascimento: new Date("2023-05-20"), descricao: "Leo é um gato tranquilo e majestoso. Ele aprecia ser mimado e passar o tempo relaxando em superfícies macias.", tamanho: TamanhoPet.MEDIO, personalidade: PersonalidadePet.CALMO, imagem_url1: "https://plus.unsplash.com/premium_photo-1707353400249-1d96e1a7e0e6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870" },

    { nome: "Daisy", especie: "Calopsita", data_nascimento: new Date("2023-04-12"), descricao: "Daisy é uma calopsita calma e sociável. Ela é uma ótima companheira que adora a tranquilidade do seu lar.", tamanho: TamanhoPet.MEDIO, personalidade: PersonalidadePet.CALMO, imagem_url1: "https://images.unsplash.com/photo-1517101724602-c257fe568157?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=812" },

    { nome: "Milo", especie: "Gato", data_nascimento: new Date("2022-12-01"), descricao: "Milo é um gato reservado, mas que aceita carinho. Ele é curioso e prefere ter seu tempo para observar o ambiente.", tamanho: TamanhoPet.PEQUENO, personalidade: PersonalidadePet.INDEPENDENTE, imagem_url1: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870" },

    { nome: "Zoe", especie: "Cachorro", data_nascimento: new Date("2020-11-03"), descricao: "Zoe é uma cachorra com muita energia. Ela adora exercícios e precisa de bastante espaço para correr e se divertir.", tamanho: TamanhoPet.GRANDE, personalidade: PersonalidadePet.BRINCALHAO, imagem_url1: "https://images.unsplash.com/photo-1630063813131-2b07bf227697?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387" },

    { nome: "Jack", especie: "Cachorro", data_nascimento: new Date("2024-01-10"), descricao: "Jack é um filhote destemido e aventureiro. Ele é pequeno, mas cheio de coragem e adora explorar.", tamanho: TamanhoPet.PEQUENO, personalidade: PersonalidadePet.BRINCALHAO, imagem_url1: "https://images.unsplash.com/photo-1723065929236-2cabbb1c685f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=869" },

    { nome: "Cleo", especie: "Cachorro", data_nascimento: new Date("2017-02-15"), descricao: "Cleo é uma cachorra idosa e serena. Ela busca um lar tranquilo e confortável onde possa passar seus dias relaxando.", tamanho: TamanhoPet.MEDIO, personalidade: PersonalidadePet.CALMO, imagem_url1: "https://images.unsplash.com/photo-1709497083259-2767f307aa55?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1031" },

    { nome: "Duke", especie: "Cachorro", data_nascimento: new Date("2021-06-28"), descricao: "Duke é um cão brincalhão e cheio de vigor. Ele tem uma beleza imponente e adora se aventurar na natureza.", tamanho: TamanhoPet.GRANDE, personalidade: PersonalidadePet.BRINCALHAO, imagem_url1: "https://images.unsplash.com/photo-1723065866755-9ef44454a004?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=465" },

    { nome: "Lily", especie: "Gato", data_nascimento: new Date("2023-09-05"), descricao: "Lily é uma gatinha muito divertida e curiosa. Ela está sempre pronta para uma boa sessão de brincadeiras.", tamanho: TamanhoPet.PEQUENO, personalidade: PersonalidadePet.BRINCALHAO, imagem_url1: "https://plus.unsplash.com/premium_photo-1673967770669-91b5c2f2d0ce?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=430" },

    { nome: "Cooper", especie: "Cachorro", data_nascimento: new Date("2022-08-11"), descricao: "Cooper é um cão sociável e amigável. Ele se adapta bem e adora fazer amizade com outros animais.", tamanho: TamanhoPet.MEDIO, personalidade: PersonalidadePet.BRINCALHAO, imagem_url1: "https://plus.unsplash.com/premium_photo-1719537437497-eb3b69c6c7b5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=388" },

    { nome: "Nala", especie: "Gato", data_nascimento: new Date("2020-03-17"), descricao: "Nala é uma gata observadora e elegante. Ela aprecia seu espaço pessoal e gosta de ter um ponto estratégico para ver o movimento.", tamanho: TamanhoPet.MEDIO, personalidade: PersonalidadePet.INDEPENDENTE, imagem_url1: "https://images.unsplash.com/photo-1597626259989-a11e97b7772d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=580" },

    { nome: "Bear", especie: "Cachorro", data_nascimento: new Date("2018-10-20"), descricao: "Bear é um gigante gentil e amável. Ele é muito calmo e se contenta em passar o tempo deitado e observando o ambiente.", tamanho: TamanhoPet.GRANDE, personalidade: PersonalidadePet.CALMO, imagem_url1: "https://plus.unsplash.com/premium_photo-1668114375002-a7794d5209b4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=869" },

    { nome: "Chloe", especie: "Gato", data_nascimento: new Date("2022-05-19"), descricao: "Chloe é uma gatinha aventureira e cheia de curiosidade. Ela adora descobrir coisas novas e brincar com tudo que vê.", tamanho: TamanhoPet.PEQUENO, personalidade: PersonalidadePet.BRINCALHAO, imagem_url1: "https://images.unsplash.com/photo-1570450466756-c1c0bc431719?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387" },

    { nome: "Riley", especie: "Cachorro", data_nascimento: new Date("2023-03-03"), descricao: "Riley é um cão extremamente inteligente e ativo. Ele precisa de desafios e adora atividades que explorem sua agilidade.", tamanho: TamanhoPet.MEDIO, personalidade: PersonalidadePet.BRINCALHAO, imagem_url1: "https://images.unsplash.com/photo-1669635842183-e43281a76bdf?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=869" },

    { nome: "Gizmo", especie: "Coelho", data_nascimento: new Date("2024-04-01"), descricao: "Gizmo é um coelho muito fofo e tranquilo. Ele é um pet dócil que adora cenouras e passar o tempo em segurança.", tamanho: TamanhoPet.PEQUENO, personalidade: PersonalidadePet.CALMO, imagem_url1: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387" },

    { nome: "Ruby", especie: "Cachorro", data_nascimento: new Date("2019-05-25"), descricao: "Ruby é uma cachorra deslumbrante e cheia de vida. Ela é atlética e adora brincar e correr em espaços abertos.", tamanho: TamanhoPet.GRANDE, personalidade: PersonalidadePet.BRINCALHAO, imagem_url1: "https://images.unsplash.com/photo-1714135400352-cf17b6919f71?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387" },

    { nome: "Oscar", especie: "Gato", data_nascimento: new Date("2021-11-29"), descricao: "Oscar é um gato reservado e gosta de se esconder. Ele aprecia ter um bom esconderijo e uma rotina previsível.", tamanho: TamanhoPet.MEDIO, personalidade: PersonalidadePet.INDEPENDENTE, imagem_url1: "https://images.unsplash.com/photo-1503844281047-cf42eade5ca5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=876" },

    { nome: "Bentley", especie: "Calopsita", data_nascimento: new Date("2023-07-14"), descricao: "Bentley é uma calopsita dócil e cantora. Ele é um companheiro que traz alegria e adora interagir com música.", tamanho: TamanhoPet.PEQUENO, personalidade: PersonalidadePet.CALMO, imagem_url1: "https://images.unsplash.com/photo-1707096656916-284aa48b50e8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387" },

    { nome: "Pipoca", especie: "Hamster", data_nascimento: new Date("2024-06-01"), descricao: "Pipoca é um hamster muito ativo, especialmente à noite. Ele é brincalhão e adora explorar sua rodinha e gaiola.", tamanho: TamanhoPet.PEQUENO, personalidade: PersonalidadePet.BRINCALHAO, imagem_url1: "https://images.unsplash.com/photo-1725522908781-3738eb43e031?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=449" },

    { nome: "Kurama", especie: "Jabuti", data_nascimento: new Date("2015-04-05"), descricao: "Kurama é um jabuti com uma natureza muito reservada. Ele gosta de passear no seu próprio ritmo e apreciar o ambiente natural.", tamanho: TamanhoPet.MEDIO, personalidade: PersonalidadePet.INDEPENDENTE, imagem_url1: "https://images.unsplash.com/photo-1585696862208-ca12defa3a78?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387" },

    { nome: "Whiskers", especie: "Gato", data_nascimento: new Date("2021-07-20"), descricao: "Whiskers é um gato brincalhão e cheio de energia. Ele adora perseguir brinquedos e está sempre pronto para uma boa caçada.", tamanho: TamanhoPet.PEQUENO, personalidade: PersonalidadePet.BRINCALHAO, imagem_url1: "https://images.unsplash.com/photo-1571566882372-1598d88abd90?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=387" },

    { nome: "Buddy", especie: "Cachorro", data_nascimento: new Date("2022-01-15"), descricao: "Buddy é um cachorro extremamente calmo e dócil. Ele adora carinho e é o companheiro perfeito para quem busca tranquilidade.", tamanho: TamanhoPet.MEDIO, personalidade: PersonalidadePet.CALMO, imagem_url1: "https://images.unsplash.com/photo-1613915588542-388135ac5f4d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870" },

    { nome: "Shadow", especie: "Gato", data_nascimento: new Date("2020-09-10"), descricao: "Shadow é um gato misterioso e muito independente. Ele aprecia sua liberdade e gosta de explorar os cantos da casa por conta própria.", tamanho: TamanhoPet.MEDIO, personalidade: PersonalidadePet.INDEPENDENTE, imagem_url1: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=580" },

  ];

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