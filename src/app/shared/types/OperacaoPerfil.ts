export interface OperacaoPerfil {
    nome: string;
    codigo: string;
    proprietario: {
        nome: string;
        email: string;
    };
    dataCadastro: Date;
    quantidadeColaboradores: number;
    quantidadeProdutos: number;
}
