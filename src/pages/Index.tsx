
import GameContainer from "@/components/GameContainer";

const Index = () => {
  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-white via-game-neutral/30 to-white overflow-hidden">
      <header className="container max-w-5xl mx-auto px-4 mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-game-text tracking-tight mb-2">
          Elegant Clicker
        </h1>
        <p className="text-game-text-secondary max-w-md mx-auto">
          A minimalist clicking experience with a focus on beautiful design and satisfying interactions.
        </p>
      </header>
      
      <GameContainer />
      
      <footer className="container max-w-5xl mx-auto px-4 py-6 mt-10 text-center text-game-text-secondary text-sm">
        <p>Elegant Clicker &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
