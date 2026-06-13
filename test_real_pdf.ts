import { uploadMedia } from './src/lib/cloudStorage.js';
import fs from 'fs';
import path from 'path';

// Minimal valid PDF structure
const minimalPdf = Buffer.from(
  '%PDF-1.1\n%¥±ë\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n5 0 obj\n<< /Length 44 >>\nstream\nBT\n/F1 24 Tf\n100 700 Td\n(Test PDF) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000015 00000 n \n0000000064 00000 n \n0000000121 00000 n \n0000000227 00000 n \n0000000315 00000 n \ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n408\n%%EOF\n'
);

async function run() {
  try {
    console.log('Uploading PDF...');
    const result = await uploadMedia(minimalPdf, 'portfolio_media', 'application/pdf', 'test-valid.pdf');
    console.log('Upload success! URL:', result.url);
    
    console.log('\nFetching headers...');
    const fetchRes = await fetch(result.url);
    console.log('Status:', fetchRes.status);
    console.log('Content-Type:', fetchRes.headers.get('content-type'));
    console.log('Content-Disposition:', fetchRes.headers.get('content-disposition'));
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
