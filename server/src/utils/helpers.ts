import { Request } from "express"
import fs from "fs";

export const getStaticFilePath = (req: Request, fileName: string) => {
    return `${req.protocol}://${req.get("host")}/images/${fileName}`;
}

export const getLocalPath = (fileName: string) => {
    return `public/images/${fileName}`
}

export const removeLocalFile = (localPath: any) => {
    fs.unlink(localPath, (err) => {
        if (err) 
            console.log("Errir while removing local files: ", err);
        else
            console.log("Removed local: ", localPath);
    })
}