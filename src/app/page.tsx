'use client';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useTornApi } from '@/hooks/useTornApi';
import { useCalculator } from '@/hooks/useCalculator';
import { useTheme } from '@/hooks/useTheme';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TableOfContents } from '@/components/layout/TableOfContents';
import { RecommendationsPanel } from '@/components/layout/RecommendationsPanel';
import { ApiKeyInput } from '@/components/calculator/ApiKeyInput';
import { ComparisonToggle } from '@/components/calculator/ComparisonToggle';

import { Section01_GettingStarted } from '@/components/guide/Section01_GettingStarted';
import { Section02_GymFormula } from '@/components/guide/Section02_GymFormula';
import { Section03_HappyJumping } from '@/components/guide/Section03_HappyJumping';
import { Section04_GymProgression } from '@/components/guide/Section04_GymProgression';
import { Section05_EnergyManagement } from '@/components/guide/Section05_EnergyManagement';
import { Section06_StatEnhancers } from '@/components/guide/Section06_StatEnhancers';
import { Section07_CompanyPerks } from '@/components/guide/Section07_CompanyPerks';
import { Section08_MeritsAndBooks } from '@/components/guide/Section08_MeritsAndBooks';
import { Section09_TrainingBreak } from '@/components/guide/Section09_TrainingBreak';

import type { EnergySources, BookBonus } from '@/types/calculator';

import dynamic from 'next/dynamic';

const StatProjectionChart = dynamic(
  () => import('@/components/charts/StatProjectionChart').then(m => ({ default: m.StatProjectionChart })),
  { ssr: false, loading: () => <div className="h-64 bg-bg-card rounded-lg animate-pulse" /> }
);

export default function Home() {
  const [apiKey, setApiKey] = useLocalStorage('tm-api-key', '');
  const tornApi = useTornApi();
  const { state, updateField, results } = useCalculator(tornApi.data);
  const { isDark, toggle: toggleTheme } = useTheme();

  const handleLoad = async () => {
    if (apiKey.trim()) {
      await tornApi.fetch(apiKey.trim());
    }
  };

  const handleClear = () => {
    setApiKey('');
    tornApi.clear();
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Header
        playerName={tornApi.data?.profile.name}
        playerLevel={tornApi.data?.profile.level}
        factionName={tornApi.data?.profile.faction?.name}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      <TableOfContents />

      <main className="max-w-4xl mx-auto px-4 py-6 lg:pr-72 space-y-12">
        {/* API Key Input */}
        <div className="bg-bg-card rounded-lg p-4 sm:p-6 border border-torn-green/20">
          <ApiKeyInput
            apiKey={apiKey}
            onApiKeyChange={setApiKey}
            onLoad={handleLoad}
            onClear={handleClear}
            loading={tornApi.loading}
            error={tornApi.error}
            playerName={tornApi.data?.profile.name}
          />
        </div>

        {/* Recommendations (mobile: inline, desktop: hidden here — shown in sidebar) */}
        <div className="lg:hidden">
          <RecommendationsPanel recommendations={results.recommendations} />
        </div>

        {/* Guide Sections */}
        <Section01_GettingStarted />

        <Section02_GymFormula
          state={state}
          results={results}
          onUpdate={updateField}
          apiPopulated={!!tornApi.data}
        />

        <Section03_HappyJumping
          currentStat={state.currentStat}
          happy={state.happy}
          happyContributionPercent={results.happyContributionPercent}
        />

        <Section04_GymProgression
          currentStat={state.currentStat}
          gymDots={state.gymDots}
        />

        <Section05_EnergyManagement
          energySources={state.energySources}
          onUpdateEnergySources={(sources: EnergySources) => updateField('energySources', sources)}
          gainPerEnergy={results.gainPerEnergy}
          results={results}
        />

        <Section06_StatEnhancers
          currentStat={state.currentStat}
          results={results}
        />

        <Section07_CompanyPerks
          trainedStat={state.trainedStat}
          companyType={state.companyType}
          onUpdateCompany={(company: string | null) => updateField('companyType', company)}
        />

        <Section08_MeritsAndBooks
          trainedStat={state.trainedStat}
          meritLevel={state.meritLevel}
          educationBonus={state.educationBonus}
          bookBonus={state.bookBonus}
          onUpdateMerit={(level: number) => updateField('meritLevel', level)}
          onUpdateEducation={(bonus: number) => updateField('educationBonus', bonus)}
          onUpdateBook={(bonus: BookBonus) => updateField('bookBonus', bonus)}
          gainPerDay={results.gainPerDay}
        />

        <Section09_TrainingBreak />

        {/* Stat Projection Chart */}
        <section className="bg-bg-card rounded-lg p-4 sm:p-6 border border-torn-green/20">
          <h2 className="text-xl font-bold text-text-primary mb-4">Stat Projection</h2>
          <StatProjectionChart
            currentStat={state.currentStat}
            gainPerDay={results.gainPerDay}
          />
        </section>

        {/* Comparison Mode */}
        <section className="bg-bg-card rounded-lg p-4 sm:p-6 border border-torn-green/20">
          <h2 className="text-xl font-bold text-text-primary mb-4">What If...?</h2>
          <ComparisonToggle
            state={state}
            results={results}
            onUpdate={updateField}
          />
        </section>
      </main>

      {/* Desktop: Floating Recommendations Sidebar */}
      <aside className="hidden lg:block fixed top-20 right-4 w-64 max-h-[calc(100vh-6rem)] overflow-y-auto">
        <RecommendationsPanel recommendations={results.recommendations} />
      </aside>

      <Footer />
    </div>
  );
}
