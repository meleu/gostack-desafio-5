import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    // do not accept the transaction if there's not enough balance
    if (type === 'outcome') {
      const { total } = this.transactionsRepository.getBalance();
      if (total < value) {
        throw Error('Insufficient balance.');
      }
    }

    // do not accept types different than 'income' and 'outcome'
    if (!['income', 'outcome'].includes(type)) {
      throw Error('Invalid transaction type.');
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
