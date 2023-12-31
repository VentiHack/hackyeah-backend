import multer from "multer";
import { Router } from "express";
import { getRegion } from "../utils/db";
import animals from "../animals";
export const api = Router();

api.get("/", async (req, res) => {
    const region = await getRegion(0, 0);
    const data = await region.findAll();
    res.json(data);
});

const upload = multer({
    storage: multer.diskStorage({
        destination: `${__dirname}/../public/storage`,
        filename: (_: any, _x: any, cb: any) => {
            cb(null, `${Date.now()}-${Math.floor(Math.random() * 100)}`);
        },
    }),
});

api.post("/submit", upload.single("file"), async (req, res) => {
    const region = await getRegion(0, 0);

    await region.create({
        img: `/public/storage/${req.file.filename}`,
        ...req.body,
    });
    res.status(200).json("ok");
});
