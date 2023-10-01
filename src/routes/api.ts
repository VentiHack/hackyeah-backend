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

api.post("/submit", upload.single("file"), async (req: any, res) => {
    const region = await getRegion(0, 0);
    console.log(req.body);
    /*await region.create({
        img: `/public/storage/${req.file.filename}`,
        ...req.body,
    });*/

    if (req.body.knownAnimalSpecies == "false") {
        const name = await recognise(req, res);
        if (name == "unknown") {
            await region.create({
                img: `/public/storage/${req.file.filename}`,
                ...req.body,
            });
            res.status(201).send("unknown");
        } else {
            await region.create({
                img: `/public/storage/${req.file.filename}`,
                ...req.body,
                animalSpecies: name,
                knownAnimalSpecies: true,
            });
            res.status(202).send(name);
        }
    } else {
        await region.create({
            img: `/public/storage/${req.file.filename}`,
            ...req.body,
        });
        res.status(203).send(req.body.animalSpecies);
    }
});

async function recognise(req: any, res: any) {
    try {
        const vision = require("@google-cloud/vision");
        const client = new vision.ImageAnnotatorClient({
            keyFilename: "./key.json",
        });
        const [result] = await client.objectLocalization(req.file.path);
        return result.localizedObjectAnnotations[0].name;
    } catch (error) {
        return "unknown";
    }
}
