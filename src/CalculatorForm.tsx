import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  InputAdornment,
} from '@mui/material';

interface Wall {
  id: number;
  height: number;
  width: number;
}

interface Door {
  id: number;
  width: number;
  height: number;
}

interface Window {
  id: number;
  width: number;
  height: number;
}

interface CalculationResults {
  totalHoursNeeded: number;
  totalCost: number;
  primerNeeded: number;
  paintNeeded: number;
  paintCanNeeded: number;
  primerCanNeeded: number;
  paintableArea: number;
}

const CalculatorForm = () => {
  const [walls, setWalls] = useState<Wall[]>([{ id: 1, height: 0, width: 0 }]);
  const [doors, setDoors] = useState<Door[]>([{ id: 1, height: 0, width: 0 }]);
  const [windows, setWindows] = useState<Window[]>([
    { id: 1, height: 0, width: 0 },
  ]);
  const [primerCover, setPrimerCover] = useState<number | null>(null);
  const [paintCover, setPaintCover] = useState<number | null>(null);
  const [paintCost, setPaintCost] = useState<number | null>(null);
  const [primerCost, setPrimerCost] = useState<number | null>(null);
  const [workerNum, setWorkerNum] = useState<number | null>(null);
  const [coatsNum, setCoatsNum] = useState<number | null>(null);
  const [results, setResults] = useState<CalculationResults | null>(null);

  const calculations = (
    walls: Wall[],
    doors: Door[],
    windows: Window[],
    primerCover: number,
    paintCover: number,
    paintCost: number,
    primerCost: number,
    workerNum: number,
    coatsNum: number
  ): CalculationResults => {
    const wallArea = walls.reduce(
      (total, wall) => total + wall.height * wall.width,
      0
    );
    const doorArea = doors.reduce(
      (total, door) => total + door.height * door.width,
      0
    );
    const windowArea = windows.reduce(
      (total, window) => total + window.height * window.width,
      0
    );
    const paintableArea = wallArea - doorArea - windowArea;

    const primerNeeded = coatsNum * (paintableArea / primerCover);
    const paintNeeded = coatsNum * (paintableArea / paintCover);

    const primerCanNeeded = Math.ceil(primerNeeded);
    const paintCanNeeded = Math.ceil(paintNeeded);

    const overallPrimerCost = primerCanNeeded * primerCost;
    const overallPaintCost = paintCanNeeded * paintCost;
    const totalCost = overallPrimerCost + overallPaintCost;

    const hoursNeeded = (paintableArea * coatsNum) / 250; // One professional painter can paint around 250 m squared per hour

    const TotalHoursNeeded = hoursNeeded / workerNum;

    return {
      totalHoursNeeded: TotalHoursNeeded,
      totalCost: totalCost,
      primerNeeded: primerNeeded,
      paintNeeded: paintNeeded,
      paintCanNeeded: paintCanNeeded,
      primerCanNeeded: primerCanNeeded,
      paintableArea: paintableArea,
    };
  };

  const handleAddWall = () => {
    setWalls([...walls, { id: walls.length + 1, height: 0, width: 0 }]);
  };

  const handleRemoveWall = (id: number) => {
    setWalls(walls.filter((wall) => wall.id !== id));
  };

  const handleWallChange = (
    id: number,
    field: 'height' | 'width',
    value: number
  ) => {
    setWalls(
      walls.map((wall) => (wall.id === id ? { ...wall, [field]: value } : wall))
    );
  };

  const handleAddDoor = () => {
    setDoors([...doors, { id: doors.length + 1, height: 0, width: 0 }]);
  };

  const handleRemoveDoor = (id: number) => {
    setDoors(doors.filter((door) => door.id !== id));
  };

  const handleDoorChange = (
    id: number,
    field: 'height' | 'width',
    value: number
  ) => {
    setDoors(
      doors.map((door) => (door.id === id ? { ...door, [field]: value } : door))
    );
  };

  const handleAddWindow = () => {
    setWindows([...windows, { id: windows.length + 1, height: 0, width: 0 }]);
  };

  const handleRemoveWindow = (id: number) => {
    setWindows(windows.filter((window) => window.id !== id));
  };

  const handleWindowChange = (
    id: number,
    field: 'height' | 'width',
    value: number
  ) => {
    setWindows(
      windows.map((window) =>
        window.id === id ? { ...window, [field]: value } : window
      )
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // const data = new FormData(event.currentTarget);
    if (
      !primerCover ||
      !paintCover ||
      !paintCost ||
      !primerCost ||
      !workerNum ||
      !coatsNum
    ) {
      return;
    }

    setResults(
      calculations(
        walls,
        doors,
        windows,
        primerCover,
        paintCover,
        paintCost,
        primerCost,
        coatsNum,
        workerNum
      )
    );
  };

  return (
    <Paper
      elevation={3}
      style={{ padding: '16px', maxWidth: '800px', margin: 'auto' }}
    >
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {walls.map((wall, index) => (
            <Grid container item spacing={2} key={wall.id}>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label={`Wall ${index + 1} Height (m)`}
                  type="number"
                  value={wall.height || ''}
                  onChange={
                    (e) => {
                      const value = e.target.value;
                      if (
                        value === '' ||
                        (!isNaN(Number(value)) && Number(value) > 0)
                      ) {
                        handleWallChange(
                          wall.id,
                          'height',
                          value === '' ? 0 : Number(value)
                        );
                      }
                    }
                    // handleWallChange(wall.id, 'height', Number(e.target.value))
                  }
                  // inputProps={{
                  //   pattern: '[0-9]*.?[0-9]+', // Allows positive numbers and decimals
                  // }}
                  required
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label={`Wall ${index + 1} Width (m)`}
                  type="number"
                  value={wall.width || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (
                      value === '' ||
                      (!isNaN(Number(value)) && Number(value) > 0)
                    ) {
                      handleWallChange(
                        wall.id,
                        'width',
                        value === '' ? 0 : Number(value)
                      );
                    }
                  }}
                  required
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleRemoveWall(wall.id)}
                  disabled={walls.length === 1}
                >
                  Remove
                </Button>
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={handleAddWall}
            >
              Add Wall
            </Button>
          </Grid>
          {doors.map((door, index) => (
            <Grid container item spacing={2} key={door.id}>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label={`Door ${index + 1} Height (m)`}
                  type="number"
                  value={door.height || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (
                      value === '' ||
                      (!isNaN(Number(value)) && Number(value) > 0)
                    ) {
                      handleDoorChange(
                        door.id,
                        'height',
                        value === '' ? 0 : Number(value)
                      );
                    }
                  }}
                  required
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label={`Door ${index + 1} Width (m)`}
                  type="number"
                  value={door.width || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (
                      value === '' ||
                      (!isNaN(Number(value)) && Number(value) > 0)
                    ) {
                      handleDoorChange(
                        door.id,
                        'width',
                        value === '' ? 0 : Number(value)
                      );
                    }
                  }}
                  required
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleRemoveDoor(door.id)}
                  disabled={doors.length === 1}
                >
                  Remove
                </Button>
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={handleAddDoor}
            >
              Add Door
            </Button>
          </Grid>
          {windows.map((window, index) => (
            <Grid container item spacing={2} key={window.id}>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label={`Window ${index + 1} Height (m)`}
                  type="number"
                  value={window.height || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (
                      value === '' ||
                      (!isNaN(Number(value)) && Number(value) > 0)
                    ) {
                      handleWindowChange(
                        window.id,
                        'height',
                        value === '' ? 0 : Number(value)
                      );
                    }
                  }}
                  required
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label={`Window ${index + 1} Width (m)`}
                  type="number"
                  value={window.width || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (
                      value === '' ||
                      (!isNaN(Number(value)) && Number(value) > 0)
                    ) {
                      handleWindowChange(
                        window.id,
                        'width',
                        value === '' ? 0 : Number(value)
                      );
                    }
                  }}
                  required
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleRemoveWindow(window.id)}
                  disabled={windows.length === 1}
                >
                  Remove
                </Button>
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={handleAddWindow}
            >
              Add Window
            </Button>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Primer Coverage"
              name="primers"
              type="number"
              value={primerCover || ''}
              onChange={(e) => {
                const value = e.target.value;
                if (
                  value === '' ||
                  (!isNaN(Number(value)) && Number(value) > 0)
                ) {
                  setPrimerCover(value === '' ? 0 : Number(value));
                }
              }}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    sq. meters/3.78 litres
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Paint Coverage"
              name="paints"
              type="number"
              value={paintCover || ''}
              onChange={(e) => {
                const value = e.target.value;
                if (
                  value === '' ||
                  (!isNaN(Number(value)) && Number(value) > 0)
                ) {
                  setPaintCover(value === '' ? 0 : Number(value));
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    sq. meters/3.78 litres
                  </InputAdornment>
                ),
              }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Number of Coats"
              name="coats"
              type="number"
              value={coatsNum || ''}
              onChange={(e) => {
                const value = e.target.value;
                if (
                  value === '' ||
                  (!isNaN(Number(value)) && Number(value) > 0)
                ) {
                  setCoatsNum(value === '' ? 0 : Number(value));
                }
              }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Primer Cost"
              name="primer can cost"
              type="number"
              value={primerCost || ''}
              onChange={(e) => {
                const value = e.target.value;
                if (
                  value === '' ||
                  (!isNaN(Number(value)) && Number(value) > 0)
                ) {
                  setPrimerCost(value === '' ? 0 : Number(value));
                }
              }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Paint Cost"
              name="paint can cost"
              type="number"
              value={paintCost || ''}
              onChange={(e) => {
                const value = e.target.value;
                if (
                  value === '' ||
                  (!isNaN(Number(value)) && Number(value) > 0)
                ) {
                  setPaintCost(value === '' ? 0 : Number(value));
                }
              }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Number of Workers"
              name="number of workers"
              type="number"
              required
              value={workerNum || ''}
              onChange={(e) => {
                const value = e.target.value;
                if (
                  value === '' ||
                  (!isNaN(Number(value)) && Number(value) > 0)
                ) {
                  setWorkerNum(value === '' ? 0 : Number(value));
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth variant="contained" color="primary" type="submit">
              Calculate
            </Button>
          </Grid>
        </Grid>
        {results !== null && (
          <Typography variant="h6" style={{ marginTop: '16px' }}>
            {/* Paint Needed: {results} gallon(s) */}
          </Typography>
        )}
        {results && (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Typography variant="h6">Results:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                Paintable Surface Area: {results.paintableArea.toFixed(2)} m²
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                Total Cost: ${results.totalCost.toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                Estimated Time: {results.totalHoursNeeded.toFixed(2)} hours
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                Primer Required: {results.primerNeeded} litres or{' '}
                {results.primerCanNeeded} cans of paint.
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                Paint Required: {results.paintNeeded} litres or{' '}
                {results.paintCanNeeded} cans of paint.
              </Typography>
            </Grid>
          </Grid>
        )}
      </form>
    </Paper>
  );
};

export default CalculatorForm;
