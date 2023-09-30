import { Request, Response } from "express";
import { getRegion } from "../utils/db";

/**
 * GET /
 * Home page.
 */
export const index = async (req: Request, res: Response): Promise<void> => {
    const region = await getRegion(0, 0);
    
    res.json(await region.findAll());
};
