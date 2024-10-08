# Project Title

Cooking Recipe Suggester

## Description

This is a project which gives cooking recipe suggestions based on saved recipes.
Visit the site [here](https://vinidercoder.github.io/cooking-recipe-suggester/#/).

## Features

- **Creating Recipes**
- **Marking public recipes**
- **Save cooked dates**
- **Get Suggestions** based on changeable settings

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- Access to a Cassandra database.

### Installation

1. Clone the repository to your local machine.
   ```bash
   git clone https://github.com/ViniDerCoder/cooking-recipe-suggester.git
   ```
2. Navigate to the backend directory.
   ```bash
   cd cooking-recipe-suggester/Backend
   ```
3. Install the required dependencies.
   ```bash
   npm install
   ```
4. Configure your Cassandra database connection by updating the relevant configuration files. (.env)

### Usage

1. Start the backend server.
   ```bash
   node .
   ```
2. The server will automatically connect to the Cassandra database and perform the scheduled cleanup tasks. It will also insert default database values once the server is ready.

## Images

- Recipe Editor: ![image](https://github.com/user-attachments/assets/271279f8-dba5-4a3b-9d03-2a1777fd10bd)
- Sample Recipe: ![image](https://github.com/user-attachments/assets/2dae5fd4-59ab-4343-8287-3337ddd70cb4)
- Suggestion Settings: ![image](https://github.com/user-attachments/assets/9d474f67-fb19-4b1a-a276-8204dce3ce40)

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or feature requests.

## License

This project is licensed under the [MIT License](LICENSE.md) - see the LICENSE file for details.
