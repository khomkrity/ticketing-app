import express from 'express';

const router = express.Router();

router.get('/api/uses/currentuser', () => {});

export { router as currentUserRouter };
