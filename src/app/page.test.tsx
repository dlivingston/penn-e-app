// src/app/page.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './page';

describe('Home Component', () => {
  it('renders the input and button', () => {
    render(<Home />);
    expect(screen.getByPlaceholderText('Enter city name')).toBeInTheDocument();
    expect(screen.getByText('Get Weather')).toBeInTheDocument();
  });

  it('updates the city state on input change', () => {
    render(<Home />);
    const input = screen.getByPlaceholderText('Enter city name');
    fireEvent.change(input, { target: { value: 'New York' } });
    expect(input).toHaveValue('New York');
  });

  it('displays error message when fetch fails', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'City not found' }),
      })
    ) as jest.Mock;

    render(<Home />);
    fireEvent.change(screen.getByPlaceholderText('Enter city name'), { target: { value: 'InvalidCity' } });
    fireEvent.click(screen.getByText('Get Weather'));

    const errorMessage = await screen.findByText('City not found');
    expect(errorMessage).toBeInTheDocument();
  });

  it('displays weather data when fetch succeeds', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            name: 'New York',
            main: { temp: 70, humidity: 50, temp_max: 75, temp_min: 65, feels_like: 68, pressure: 1012 },
            weather: [{ description: 'clear sky', icon: '01d' }],
            visibility: 10000,
            wind: { speed: 10 },
          }),
      })
    ) as jest.Mock;

    render(<Home />);
    fireEvent.change(screen.getByPlaceholderText('Enter city name'), { target: { value: 'New York' } });
    fireEvent.click(screen.getByText('Get Weather'));

    const weatherData = await screen.findByText((content, element) => {
      return element?.tagName === 'H2' && content.trim() === 'New York';
    });
    expect(weatherData).toBeInTheDocument();
    expect(screen.getByText('70°')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('clear sky')).toBeInTheDocument();
    expect(screen.getByText('10 mph')).toBeInTheDocument();
  });
});