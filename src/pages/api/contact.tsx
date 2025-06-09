import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../backend/dist/lib/dbConnect';
import  ContactUs from '../../../backend/dist/models/contactus';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const contactEntry = await ContactUs.create(req.body);
      res.status(201).json({ success: true, data: contactEntry });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
