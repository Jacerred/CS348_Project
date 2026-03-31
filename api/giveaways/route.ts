import { prisma } from '@/lib/prisma';


/*
 * Fetch all giveaways
 */
export async function GET() {
  const giveaways = await prisma.giveaway.findMany({
    include: {
      show: {
        include: {
          seller: true
        }
      }
    }
  });

  return Response.json(giveaways);
}

/*
 * Create giveaway
 */
export async function POST(req: Request) {
  const data = await req.json();

  const giveaway = await prisma.giveaway.create({
    data: {
      showId: data.showId,
      endTime: new Date(data.endTime),
      isContinuous: data.isContinuous
    }
  });

  return Response.json(giveaway);
}


/*
 * Delete giveaway
 */
export async function DELETE(req: Request) {
  const { id } = await req.json();

  await prisma.giveaway.delete({
    where: { id }
  });

  return Response.json({ success: true });
}