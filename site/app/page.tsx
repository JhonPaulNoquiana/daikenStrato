import { CinematicRoom } from '@/components/experience/cinematic-room';
import { Narrative } from '@/components/experience/narrative';
import { ProductUniverse } from '@/components/sections/product-universe';

export default function Home() {
  return <><main className="experience-shell"><div className="experience-stage"><CinematicRoom /><div className="cinematic-grade" /><Narrative /></div></main><ProductUniverse /></>;
}
