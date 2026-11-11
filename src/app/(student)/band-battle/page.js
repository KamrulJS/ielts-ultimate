import { StudentShell } from '@/layouts/StudentShell';
import { BandBattleView } from '@/modules/band-battle/BandBattleView';

export const metadata = {
  title: 'Band Battle — IELTSWIST',
  description: 'Compete on global IELTS leaderboards and challenge students in live 1-on-1 quiz duels.',
};

export default function BandBattlePage() {
  return (
    <StudentShell>
      <BandBattleView />
    </StudentShell>
  );
}

