import fs from "fs";
import jwt from "jsonwebtoken";

export default function handler(req, res) {
    const teamId = "PC84YF525S";
    const keyId = "9B83MQYGSJ";
    const privateKey = fs.readFileSync("./AuthKey_X324HMKBA9.p8").toString();

    const token = jwt.sign({}, privateKey, {
        algorithm: "ES256",
        expiresIn: "180d",
        issuer: teamId,
        header: {
            alg: "ES256",
            kid: keyId,
        },
    });

    res.status(200).json({ token });
}
