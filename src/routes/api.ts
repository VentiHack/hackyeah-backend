import multer from "multer";
import { Router } from "express";
import { getRegion } from "../utils/db";

export  const api = Router();

api.get("/", async (req, res) => {
  const region = await getRegion(0, 0);
  const data = await region.findAll();

  data.push({ 
    img: "/public/storage/1623770790000-0",
    animalSpecies: "test",
    knownAnimalSpecies: true,
    latitude: 51.95,
    longitude: 19.2,
    additionalInfo: "test",
  });
  // console.log(data);
  res.json(data);
});




const upload = multer({ 
  storage: multer.diskStorage({
    destination: `${__dirname}/../public/storage`,
    filename: (_, _x, cb) => {
      cb(null, `${Date.now()}-${Math.floor(Math.random() * 100)}`);
    },
  }),
});

api.post('/submit',
  upload.single('file'), 
  async (req, res) => {
    const region = await getRegion(0, 0);

    await region.create({ img: `/public/storage/${req.file.filename}`, ...req.body });
    res.status(200).json("ok");
  },
);
