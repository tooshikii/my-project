import { NextRequest, NextResponse } from "next/server";

export interface Album {
  artist: string;
  externalId: string;
  id: number;
  image: string;
  label: string | null;
  order: number;
  releaseDate: string;
  releaseTitle: string | null;
  streamURL: string;
  title: string;
  type: string;
  url: string;
}

const MockData = [
  {
    id: 736029,
    artist: "BOOF",
    externalId: "2210233416",
    image: "https://f4.bcbits.com/img/a3643946420_2.jpg",
    label: "BubbleTease Communications",
    order: 0,
    releaseDate: "2025-02-14T00:00:00.000Z",
    releaseTitle: "Night Blooming Cereus",
    streamURL:
      "https://bandcamp.com/stream_redirect?enc=mp3-128&track_id=2210233416&ts=1747344849&t=e27e08a461a43526270b78bd899c06a0cefddd06",
    title: "I Want C & B To Fix My Car",
    type: "song",
    url: "https://boofbubbletease.bandcamp.com/track/i-want-c-b-to-fix-my-car",
  },
  {
    id: 736030,
    artist: "Kim English",
    externalId: "3532674275",
    image: "https://f4.bcbits.com/img/a1204811350_2.jpg",
    label: null,
    order: 1,
    releaseDate: "2024-01-05T00:00:00.000Z",
    releaseTitle: "Missing You",
    streamURL:
      "https://bandcamp.com/stream_redirect?enc=mp3-128&track_id=3532674275&ts=1759253048&t=b48127d9e39e76c2fce12f5453022617c942d2dd",
    title: "Missing You\tDJ Dove Breakthru Dub",
    type: "song",
    url: "https://nervousrecords.bandcamp.com/track/missing-you-dj-dove-breakthru-dub",
  },
  {
    id: 736031,
    artist: "Lack / Tonto / Chekov / Perfume Advert",
    externalId: "2968108013",
    image: "https://f4.bcbits.com/img/a0585044943_2.jpg",
    label: null,
    order: 2,
    releaseDate: "2020-02-24T00:00:00.000Z",
    releaseTitle: "Cong Burn 06",
    streamURL:
      "https://bandcamp.com/stream_redirect?enc=mp3-128&track_id=2968108013&ts=1747344852&t=a9451713ce2ccf1d297ef3d59a55b2fe1c6f4dcf",
    title: "Lack - Flutter",
    type: "song",
    url: "https://congburn.bandcamp.com/track/lack-flutter",
  },
  {
    id: 736032,
    artist: "Virtual Suspects feat. Gwen McCrae",
    externalId: "929306402",
    image: "https://f4.bcbits.com/img/a2491750782_2.jpg",
    label: null,
    order: 3,
    releaseDate: "2002-06-25T00:00:00.000Z",
    releaseTitle: "Plastic Surgery 3",
    streamURL:
      "https://bandcamp.com/stream_redirect?enc=mp3-128&track_id=929306402&ts=1747344852&t=3430ffb1305d9412ed320e4147c9c4a9d01d6df8",
    title: "Gotta Have Your Love",
    type: "song",
    url: "https://hospitalrecords.bandcamp.com/track/gotta-have-your-love",
  },
  {
    id: 736033,
    artist: "D'Monk",
    externalId: "3706561893",
    image: "https://f4.bcbits.com/img/a3772995673_2.jpg",
    label: null,
    order: 4,
    releaseDate: "2024-11-15T00:00:00.000Z",
    releaseTitle: "SHUSH Vol. 1",
    streamURL:
      "https://bandcamp.com/stream_redirect?enc=mp3-128&track_id=3706561893&ts=1747344849&t=9c08ce64ac9f48696c97a179572bfb9b42ff8129",
    title: "Love Or Lust (Raw Mix)",
    type: "song",
    url: "https://shushrecords.bandcamp.com/track/love-or-lust-raw-mix",
  },
  {
    id: 736552,
    artist: "Jon E.",
    externalId: "3002531197",
    image: "https://f4.bcbits.com/img/a2225938437_2.jpg",
    label: null,
    order: 5,
    releaseDate: "2025-02-14T00:00:00.000Z",
    releaseTitle: "Smoke",
    streamURL:
      "https://bandcamp.com/stream_redirect?enc=mp3-128&track_id=3002531197&ts=1751383169&t=022c19a8f73dee076e501ab3cc1ac05f7c98f20c",
    title: "Sunflowers",
    type: "song",
    url: "https://naturalelementmusic.bandcamp.com/track/sunflowers",
  },
  {
    id: 736553,
    artist: "JD. REID",
    externalId: "3750766018",
    image: "https://f4.bcbits.com/img/a0482209136_2.jpg",
    label: null,
    order: 6,
    releaseDate: "2024-02-23T00:00:00.000Z",
    releaseTitle: "sometimes i wonder 001",
    streamURL:
      "https://bandcamp.com/stream_redirect?enc=mp3-128&track_id=3750766018&ts=1747344852&t=5efa1557de754bf2739a74175caa3f0bad33f76a",
    title: "plug",
    type: "song",
    url: "https://jdreid.bandcamp.com/track/plug",
  },
  {
    id: 721083,
    artist: "Mia Koden",
    externalId: "3091646000",
    image: "https://f4.bcbits.com/img/a3733805043_2.jpg",
    label: null,
    order: 6,
    releaseDate: "2024-04-25T00:00:00.000Z",
    releaseTitle: "34U",
    streamURL:
      "https://bandcamp.com/stream_redirect?enc=mp3-128&track_id=3091646000&ts=1749758684&t=56cfaf30a78b10228473410f7ee6463a4bfaca5b",
    title: "Wait A Minute",
    type: "song",
    url: "https://miakoden.bandcamp.com/track/wait-a-minute",
  },
  {
    id: 736034,
    artist: "Steven Julien",
    externalId: "3179973559",
    image: "https://f4.bcbits.com/img/a0927689198_2.jpg",
    label: "Apron Records",
    order: 6,
    releaseDate: "2024-09-13T00:00:00.000Z",
    releaseTitle: "Wraap't",
    streamURL:
      "https://bandcamp.com/stream_redirect?enc=mp3-128&track_id=3179973559&ts=1747344852&t=fa55119bac971cafda9b00ac9440c4ada8afbac0",
    title: "Wraap't feat. Fatima (AceMo Remix)",
    type: "song",
    url: "https://stevenjulien.bandcamp.com/track/wraapt-feat-fatima-acemo-remix",
  },
  {
    id: 736554,
    artist: "1905",
    externalId: "2332658686",
    image: "https://f4.bcbits.com/img/a1949562192_2.jpg",
    label: null,
    order: 10,
    releaseDate: "2025-02-14T00:00:00.000Z",
    releaseTitle: null,
    streamURL:
      "https://bandcamp.com/stream_redirect?enc=mp3-128&track_id=2332658686&ts=1747344852&t=5bf95554635e692b6d9ad7fd765db1818c944ab2",
    title: "Let´s Chill",
    type: "song",
    url: "https://real1905.bandcamp.com/track/let-s-chill",
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userName: string }> },
) {
  const { userName } = await params;

  if (!userName) {
    return NextResponse.json({ error: "Username required" }, { status: 400 });
  }

  // Mock data - replace with actual DB query
  const albums: Album[] = MockData;

  return NextResponse.json({
    userName,
    albums,
    count: albums.length,
  });
}
