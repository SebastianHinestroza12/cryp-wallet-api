import { Response, Request, NextFunction } from 'express';
import { WalletService } from '../services/wallet.service';
import { sequelize } from '../database';
import { WalletAttributes } from '../types';
import status from 'http-status';

class WalletController {
  static readonly getWalletByUserId = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const allWalletByUser = await WalletService.getWalletByUserId(id);
      return res.status(status.OK).json({ wallets: allWalletByUser });
    } catch (error) {
      next(error);
    }
  };

  static readonly createWallet = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name } = req.body as WalletAttributes;
    const transaction = await sequelize.transaction();
    try {
      const createWallet = await WalletService.createWallet(id, name, transaction);
      await transaction.commit();
      return res.status(status.CREATED).json({ wallet: createWallet });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  };

  static readonly setWalletById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name } = req.body as WalletAttributes;
    try {
      await WalletService.setWalletById(id, name);
      return res.status(status.OK).json({
        update: true,
        message: 'Wallet updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}

export { WalletController };
