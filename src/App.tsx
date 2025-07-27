import AppRouter from "@/router";
import { AppProviders } from "@/providers/AppProviders";
import { ALL_CHALLENGES, CATEGORIES } from "@/constants/challenges";

function App() {
  return (
    <AppProviders allChallenges={ALL_CHALLENGES} categories={CATEGORIES}>
      <AppRouter />
    </AppProviders>
  );
}

export default App;
