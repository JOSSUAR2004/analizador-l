import React, { useState } from 'react';
import { Button, TextareaAutosize, List, ListItem, Container, Typography } from '@material-ui/core';

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('idle');

  const isValidVariable = (v) => {
    const regex = /^[a-zA-Z][a-zA-Z0-9_]{0,14}$/;
    return regex.test(v);
  }

  const analyze = () => {
    const variableTypes = ["entero", "real", "cadena", "lógico", "fecha"];
    const lines = input.split(/\n/);
    const errors = [];
    const variables = {};

    variableTypes.forEach(type => variables[type] = []);

    lines.forEach((line, index) => {
      const match = line.match(/^declare (.+) (entero|real|cadena|lógico|fecha);$/);
      if (match) {
        const vars = match[1].split(',').map(v => v.trim());
        for (const variable of vars) {
          if (!isValidVariable(variable)) {
            errors.push(`Error en línea ${index + 1}`);
            break;
          }
        }
        variables[match[2]].push(...vars);
      } else {
        errors.push(`Error en línea ${index + 1}`);
      }
    });

    if (errors.length === 0) {
      setResult(variables);
      setStatus('success');
    } else {
      setResult(errors);
      setStatus('error');
    }
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Analizador Léxico
      </Typography>
      <TextareaAutosize
        value={input}
        onChange={e => setInput(e.target.value)}
        rowsMin={10}
        style={{ width: '100%', marginBottom: '20px' }}
        placeholder="Introduce las declaraciones..."
      />
      <Button variant="contained" color="primary" onClick={analyze}>
        Analizar
      </Button>
      <div className="result" style={{ marginTop: '20px' }}>
        {status === 'success' && Object.entries(result).map(([type, vars]) => (
          <div key={type}>
            <Typography variant="h6">{type}</Typography>
            <List>
              {vars.map((variable, index) => (
                <ListItem key={index}>
                  {variable}
                </ListItem>
              ))}
            </List>
          </div>
        ))}
        {status === 'error' && (
          <List>
            {result.map((error, index) => (
              <ListItem key={index} style={{ color: 'red' }}>
                {error}
              </ListItem>
            ))}
          </List>
        )}
      </div>
    </Container>
  );
}

export default App;