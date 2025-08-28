// src/components/ui/card.js
export const Card = ({ children, className }) => (
    <div className={`rounded-lg border bg-white ${className}`}>
      {children}
    </div>
  );
  
  export const CardContent = ({ children, className }) => (
    <div className={className}>{children}</div>
  );
  
  // src/components/ui/alert.js
  export const Alert = ({ children, className }) => (
    <div className={`rounded-lg border p-4 ${className}`}>
      {children}
    </div>
  );
  
  export const AlertTitle = ({ children }) => (
    <h5 className="font-medium mb-1">{children}</h5>
  );
  
  export const AlertDescription = ({ children }) => (
    <div className="text-sm">{children}</div>
  );