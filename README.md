<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Sobre o projeto
Para a resolução do desafio eu utilizei o framework `NestJs` por ser robusto e poderoso para aplicações node. Utilizei a biblioteca `Multer` para fazer o Upload do Arquivo XLSX ou CSV e enviar às funções utilitárias para extrair os dados necessários e enviar a resposta da requisição trazendo dados prontos para uso, mostrando o total de cada MRR mensalmente.<br/>
Optei por utilizar o `ReactJs` no Frontend por ser uma tecnologia que já tenho contato a mais tempo, usei a biblioteca `Chart.js` para plotar os dados da requisição em um gráfico de barra e também mostrar, em alguns cards, outros dados que podem ser relevantes usando a biblioteca `Mantine` para facilitar o uso de estilos e componentes prontos.<br/>

# Documentação
`http://localhost:3000/api/v1/docs` para acessar a documentação da API feita com o Swagger

# **Executando localmente**

## Instruções
- Para executar localmente utilize `docker-compose up`
- Entre com `localhost` na URL do Navegador

