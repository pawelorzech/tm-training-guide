'use client';

function ChecklistItem({ text, done = false }: { text: string; done?: boolean }) {
  return (
    <li className="flex items-start gap-3 text-sm text-text-primary">
      <span
        className={`shrink-0 mt-0.5 w-5 h-5 rounded border flex items-center justify-center text-xs font-bold ${
          done
            ? 'border-torn-green bg-torn-green/20 text-torn-green'
            : 'border-gray-500 text-transparent'
        }`}
      >
        ✓
      </span>
      <span>{text}</span>
    </li>
  );
}

function ChecklistBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-bg-card border-l-4 border-torn-green rounded-r-xl p-5 space-y-3">
      <h4 className="font-semibold text-torn-green text-base">{title}</h4>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <ChecklistItem key={i} text={item} />
        ))}
      </ul>
    </div>
  );
}

export function Section09_TrainingBreak() {
  return (
    <section id="training-break" className="space-y-6">
      <h2 className="text-2xl font-bold text-text-primary border-b border-gray-700 pb-3">
        Preparing for Training Break
      </h2>

      {/* Context */}
      <div className="space-y-3 text-text-primary leading-relaxed">
        <p>
          TM and many factions run periodic{' '}
          <strong className="text-torn-green">training breaks</strong> for Ranked Wars. When a break
          hits, you stop gym training and redirect your energy toward the war effort.
        </p>
        <p>
          The difference between players who plan and those who don&apos;t is huge. A well-prepared
          break costs you almost nothing in long-term gains — and a badly-handled one wastes days of
          stockpiled resources.
        </p>
      </div>

      {/* Before break */}
      <ChecklistBlock
        title="Before the break starts"
        items={[
          'Use all your Xanax before the break starts — don\'t let them sit unused',
          'Coordinate timing with your Steadfast rotation to squeeze out max final gains',
          'Save FHCs for a post-break burst window, or sell them if you won\'t use them',
          'Use your point refill before the break begins',
          'Note what energy sources you have stockpiled (cans, FHCs, Xanax count)',
        ]}
      />

      {/* During break */}
      <div className="bg-bg-card border-l-4 border-warning rounded-r-xl p-5 space-y-3">
        <h4 className="font-semibold text-warning text-base">During the break</h4>
        <ul className="space-y-2.5">
          {[
            'Don\'t waste energy — stack for the war. Every point matters in Ranked.',
            'Hold FHCs and cans; they\'re better used in a post-break burst train.',
            'Focus on war-related activities: attacking, mugging, defending, hospital chaining.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-text-primary">
              <span className="shrink-0 mt-0.5 text-warning">▸</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* After break */}
      <ChecklistBlock
        title="After the break ends"
        items={[
          'Resume your normal gym schedule immediately — don\'t coast',
          'Consider using saved resources during an active book window for maximum burst',
          'Coordinate with your faction for the next Steadfast timing',
          'Stack FHCs, cans, and Xanax together if you have a 30% book ready',
        ]}
      />

      {/* Strategy callout */}
      <div className="bg-bg-secondary border border-torn-green/40 rounded-xl p-5 flex gap-3 items-start">
        <span className="text-torn-green text-xl mt-0.5 shrink-0">★</span>
        <div className="space-y-1">
          <p className="font-semibold text-torn-green">Best book timing</p>
          <p className="text-sm text-text-primary">
            The best time to buy a 30% book is right after a training break ends. Stack it with
            saved FHCs, cans, and Steadfast for maximum impact. You lose almost nothing during the
            break, and you come out the other side with a fully loaded burst window.
          </p>
        </div>
      </div>

      {/* TL;DR */}
      <div className="bg-bg-secondary border border-gray-600 rounded-xl p-5">
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">TL;DR</p>
        <ul className="space-y-2">
          {[
            'Before break: burn all energy (Xanax, refills), save items for after',
            'During break: focus on war, don\'t waste resources on gym',
            'After break: burst train with saved resources + book window',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text-primary">
              <span className="text-torn-green mt-0.5 shrink-0">▸</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
