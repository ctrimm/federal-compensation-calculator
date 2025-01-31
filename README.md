# Federal Employee Total Compensation Calculator

A modern web application that helps federal employees understand their total compensation package, including base pay, locality adjustments, and benefits.

## Features

- Calculate total compensation based on GS grade and step
- Adjust for locality pay areas (DC, SF, NYC)
- Visualize compensation breakdown with interactive charts
- Include benefits calculations:
  - FERS Basic Benefit
  - TSP contributions and matching
  - FEHB (Federal Employee Health Benefits)
  - FEGLI (Federal Employee Group Life Insurance)
  - Annual and Sick Leave value

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ctrimm/federal-compensation-calculator.git
cd federal-compensation-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

To create a production build:

```bash
npm run build
```

## Technology Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Recharts for data visualization
- shadcn/ui for UI components

## Data Sources

- GS Pay Tables: 2025 General Schedule (GS) base pay rates
- Locality Pay Rates: Current locality pay percentages for major metropolitan areas
- Benefits Calculations: Based on standard federal employee benefit formulas

## License

This project is open source and available under the MIT License.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Acknowledgments

- U.S. Office of Personnel Management (OPM) for providing federal employment data and guidelines
- Federal employee community for feedback and suggestions
