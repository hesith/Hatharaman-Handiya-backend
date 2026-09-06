import Purchases from "../models/purchaseModel.js";

export async function RecordPurchase(req, res) {
    try {
        const { userId, productId, purchaseToken, platform } = req.body;

        if (!userId || !productId) {
            return res.status(400).send();
        }

        const existing = await Purchases.findOne({ _id: userId });

        if (existing == null) {
            const purchase = new Purchases({
                _id: userId,
                userId,
                productId,
                purchaseToken,
                platform,
                createdAt: new Date(),
            });
            await purchase.save();
        }

        res.status(200).send();
    }
    catch (e) {
        console.log(e);
        res.status(400).send();
    }
}

export async function GetPurchaseStatus(req, res) {
    try {
        const userId = req.params?.userId;

        if (!userId) {
            return res.json({ adsRemoved: false });
        }

        const existing = await Purchases.findOne({ _id: userId });
        res.json({ adsRemoved: existing != null });
    }
    catch (e) {
        console.log(e);
        res.json({ adsRemoved: false });
    }
}
