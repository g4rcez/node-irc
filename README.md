# Node-Irc

Essa é uma implementação do IRC em Node. Para rodar os serviços, apenas um host na rede deve possuir o código servidor.
[Download NodeJS](https://nodejs.org/en/download/). Após instalado, apenas rode o comando 'node' para ter acesso


## Executando o servidor
O código do servidor está no diretório './server'. Para executar o comando, entre no diretório server e rode os comandos
```
$ npm install
$ node index.js
```

A porta do serviço será exibida no terminal, por default é a porta 6667 (padrão do protocolo IRC)

## Executando o cliente
O código do cliente está no arquivo './client'. Para executar o comando:
```
# node cliente.js --host=<IP_DO_SERVIDOR>
```

Feito isso, o cliente já estará conectado e pronto para o uso do chat

## Bônus: Bot
