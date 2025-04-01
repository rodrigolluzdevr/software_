interface PageHeaderProps {
    title: string;
    buttonLabel?: string;
    onButtonClick?: () => void;
  }
  
  export const PageHeader: React.FC<PageHeaderProps> = ({ 
    title, 
    buttonLabel, 
    onButtonClick 
  }) => (
    <header className="flex flex-row justify-between items-center mb-4">
      <h1 className="text-lg font-semibold">{title}</h1>
      
      {buttonLabel && (
        <button
          onClick={onButtonClick}
          className="py-1 px-4 font-semibold tracking-wide border rounded-md 
                   bg-blue-500 hover:bg-white border-blue-500 hover:border-blue-500 
                   text-white hover:text-blue-500 transition-colors"
          aria-label={buttonLabel}
        >
          {buttonLabel}
        </button>
      )}
    </header>
  );