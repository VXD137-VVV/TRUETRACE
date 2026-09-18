import { NextResponse } from 'next/server';
import { readDatabase, writeDatabase } from '@/lib/server/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const db = readDatabase();
    const product = db.products.find((p) => p.id === params.id || p.sku === params.id);

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const db = readDatabase();
    db.products = db.products.filter((p) => p.id !== params.id && p.sku !== params.id);
    writeDatabase(db);

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}
