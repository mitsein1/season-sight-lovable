
import { SeasonaxProvider } from "@/context/SeasonaxContext";
import Dashboard from "./Dashboard";

const Index = () => {
  return (
    <SeasonaxProvider>
      <Dashboard />
    </SeasonaxProvider>
  );
};

export default Index;
