import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';

export function detectInitialDirection(maze, startX, startY) {
    const directions = [
        { dx: 0, dy: -1, value: 0 },   // Norte
        { dx: 1, dy: 0, value: 4 },    // Leste  
        { dx: 0, dy: 1, value: 8 },    // Sul
        { dx: -1, dy: 0, value: 12 }   // Oeste
    ];
    
    for (let dir = 0; dir < directions.length; dir++) {
        const nx = startX + directions[dir].dx;
        const ny = startY + directions[dir].dy;
        
        if (ny >= 0 && ny < maze.length && nx >= 0 && nx < maze[0].length) {
            if (maze[ny][nx] === 1) {
                return directions[dir].value;
            }
        }
    }
    
    return 4;
}

export function MazeRenderer({ mazeData, playerPosition, playerVisible = true}) {
    const svgRef = useRef(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const animationTimeouts = useRef([]);

    const SQUARE_SIZE = 50;
    const PEGMAN_HEIGHT = 52;
    const PEGMAN_WIDTH = 49;
    const ROWS = mazeData.length;
    const COLS = mazeData[0]?.length || 0;
    const MAZE_WIDTH = SQUARE_SIZE * COLS;
    const MAZE_HEIGHT = SQUARE_SIZE * ROWS;

    const STEP_SPEED = 100;
    const CRASH_STOP = 1;
    const CRASH_SPIN = 2;
    const CRASH_FALL = 3;

    const displayPegman = useCallback((x, y, direction, opt_angle) => {
        if (!svgRef.current) return;

        const pegmanIcon = svgRef.current.querySelector('#pegman');
        const clipRect = svgRef.current.querySelector('#clipRect');

        if (!pegmanIcon || !clipRect) return;

        const pegmanX = x * SQUARE_SIZE - direction * PEGMAN_WIDTH + 1;
        const pegmanY = SQUARE_SIZE * (y + 0.5) - PEGMAN_HEIGHT / 2 - 8;
        
        pegmanIcon.setAttribute('x', pegmanX);
        pegmanIcon.setAttribute('y', pegmanY);

        if (opt_angle) {
            pegmanIcon.setAttribute('transform', 'rotate(' + opt_angle + ', ' +
                (x * SQUARE_SIZE + SQUARE_SIZE / 2) + ', ' +
                (y * SQUARE_SIZE + SQUARE_SIZE / 2) + ')');
        } else {
            pegmanIcon.setAttribute('transform', 'rotate(0, 0, 0)');
        }
        clipRect.setAttribute('x', x * SQUARE_SIZE + 1);
        clipRect.setAttribute('y', pegmanIcon.getAttribute('y'));
    }, []);

    const constrainDirection16 = useCallback((d) => {
        d = Math.round(d) % 16;
        if (d < 0) {
            d += 16;
        }
        return d;
    }, []);

    const scheduleAnimation = useCallback((callback, delay) => {
        const timeoutId = setTimeout(callback, delay);
        animationTimeouts.current.push(timeoutId);
        return timeoutId;
    }, []);

    const setPegmanVisibility = useCallback((visible) => {
        if (!svgRef.current) return;

        const pegmanIcon = svgRef.current.querySelector('#pegman');
        const clipRect = svgRef.current.querySelector('#clipRect');

        if (!pegmanIcon || !clipRect) return;

        if (visible) {
            pegmanIcon.style.display = 'block';
            clipRect.style.display = 'block';
        } else {
            pegmanIcon.style.display = 'none';
            clipRect.style.display = 'none';
        }
    }, []);    

    const scheduleInitialAnimation = useCallback((x, y, direction) => {
        if (!svgRef.current) return;

        // Usar a direção diretamente, sem modificar
        displayPegman(x, y, direction);

        scheduleAnimation(() => {
            displayPegman(x, y, 16);
        }, 0);

        scheduleAnimation(() => {
            displayPegman(x, y, 18);
        }, STEP_SPEED);

        scheduleAnimation(() => {
            displayPegman(x, y, 16);
        }, STEP_SPEED * 2);

        scheduleAnimation(() => {
            displayPegman(x, y, direction); // Voltar para a direção correta
        }, STEP_SPEED * 3);

    }, [displayPegman, scheduleAnimation]);

    const scheduleMove = useCallback((startPos, endPos, onComplete) => {
        const deltas = [
            (endPos[0] - startPos[0]) / 4,
            (endPos[1] - startPos[1]) / 4,
            (endPos[2] - startPos[2]) / 4
        ];

        displayPegman(
            startPos[0] + deltas[0],
            startPos[1] + deltas[1],
            constrainDirection16(startPos[2] + deltas[2])
        );

        scheduleAnimation(() => {
            displayPegman(
                startPos[0] + deltas[0] * 2,
                startPos[1] + deltas[1] * 2,
                constrainDirection16(startPos[2] + deltas[2] * 2)
            );
        }, STEP_SPEED);

        scheduleAnimation(() => {
            displayPegman(
                startPos[0] + deltas[0] * 3,
                startPos[1] + deltas[1] * 3,
                constrainDirection16(startPos[2] + deltas[2] * 3)
            );
        }, STEP_SPEED * 2);

        scheduleAnimation(() => {
            displayPegman(
                endPos[0],
                endPos[1],
                constrainDirection16(endPos[2])
            );
            if (onComplete) onComplete();
        }, STEP_SPEED * 3);
    }, [constrainDirection16, displayPegman, scheduleAnimation]);
    
    const scheduleFail = useCallback((direction, crashType = CRASH_STOP) => {
        let deltaX = 0;
        let deltaY = 0;

        switch (direction) {
            case 0: // North
                deltaY = -1;
                break;
            case 1: // East
                deltaX = 1;
                break;
            case 2: // South
                deltaY = 1;
                break;
            case 3: // West
                deltaX = -1;
                break;
        }

        const currentX = playerPosition?.x || 0;
        const currentY = playerPosition?.y || 0;
        const currentDirection = playerPosition?.direction || 0;

        if (crashType === CRASH_STOP) {
            deltaX /= 4;
            deltaY /= 4;
            const direction16 = constrainDirection16(currentDirection * 4);

            displayPegman(currentX + deltaX, currentY + deltaY, direction16);

            scheduleAnimation(() => {
                displayPegman(currentX, currentY, direction16);
            }, STEP_SPEED);

            scheduleAnimation(() => {
                displayPegman(currentX + deltaX, currentY + deltaY, direction16);
            }, STEP_SPEED * 2);

            scheduleAnimation(() => {
                displayPegman(currentX, currentY, direction16);
            }, STEP_SPEED * 3);

        } else if (crashType === CRASH_SPIN || crashType === CRASH_FALL) {
            const deltaZ = (Math.random() - 0.5) * 10;
            const deltaD = (Math.random() - 0.5) / 2;
            deltaX += (Math.random() - 0.5) / 4;
            deltaY += (Math.random() - 0.5) / 4;
            deltaX /= 8;
            deltaY /= 8;

            let acceleration = 0;
            if (crashType === CRASH_FALL) {
                acceleration = 0.01;
            }

            const setPosition = (n) => {
                return () => {
                    const direction16 = constrainDirection16(currentDirection * 4 + deltaD * n);
                    displayPegman(
                        currentX + deltaX * n,
                        currentY + deltaY * n,
                        direction16,
                        deltaZ * n
                    );
                    deltaY += acceleration;
                };
            };

            for (let i = 1; i < 100; i++) {
                scheduleAnimation(setPosition(i), STEP_SPEED * i / 2);
            }
        }
    }, [constrainDirection16, playerPosition, scheduleAnimation, displayPegman]);

    const scheduleVictory = useCallback(() => {
        const currentX = playerPosition?.x || 0;
        const currentY = playerPosition?.y || 0;
        const currentDirection = playerPosition?.direction || 0;
        const direction16 = constrainDirection16(currentDirection * 4);

        displayPegman(currentX, currentY, 16);

        scheduleAnimation(() => {
            displayPegman(currentX, currentY, 18);
        }, 150);

        scheduleAnimation(() => {
            displayPegman(currentX, currentY, 16);
        }, 300); scheduleAnimation(() => {
            displayPegman(currentX, currentY, direction16);
        }, 450);
    }, [constrainDirection16, playerPosition, scheduleAnimation, displayPegman]);

    const scheduleLook = useCallback((lookDirection) => {
        const currentX = playerPosition?.x || 0;
        const currentY = playerPosition?.y || 0;

        let x = currentX;
        let y = currentY;

        switch (lookDirection) {
            case 0: // North
                x += 0.5;
                break;
            case 1: // East
                x += 1;
                y += 0.5;
                break;
            case 2: // South
                x += 0.5;
                y += 1;
                break;
            case 3: // West
                y += 0.5;
                break;
        }

        x *= SQUARE_SIZE;
        y *= SQUARE_SIZE;
        const deg = lookDirection * 90 - 45;

        if (svgRef.current) {
            let lookIcon = svgRef.current.querySelector('#lookIcon');
            if (!lookIcon) {
                lookIcon = createSvgElement('g', {
                    'id': 'lookIcon',
                    'style': 'display: none'
                }, svgRef.current);

                for (let i = 0; i < 4; i++) {
                    createSvgElement('circle', {
                        'r': 5 + i * 3,
                        'fill': 'none',
                        'stroke': '#00ff00',
                        'stroke-width': '2',
                        'opacity': 0.7 - i * 0.15
                    }, lookIcon);
                }
            }

            lookIcon.setAttribute('transform',
                `translate(${x}, ${y}) rotate(${deg} 0 0) scale(0.4)`);
            lookIcon.style.display = 'inline';

            const circles = lookIcon.querySelectorAll('circle');
            circles.forEach((circle, i) => {
                scheduleAnimation(() => {
                    circle.style.display = 'inline';
                    scheduleAnimation(() => {
                        circle.style.display = 'none';
                    }, STEP_SPEED * 2);
                }, STEP_SPEED * i);
            });

            scheduleAnimation(() => {
                lookIcon.style.display = 'none';
            }, STEP_SPEED * 6);
        }
    }, [playerPosition, scheduleAnimation]);

    
    useEffect(() => {
        if (isInitialized) {
            window.automatoAnimations = {
                scheduleMove,
                scheduleFail,
                scheduleVictory,
                scheduleLook,
                scheduleInitialAnimation,
                resetPegman: (x, y, direction) => {
                    displayPegman(x, y, direction * 4);
                }
            };
        }
    }, [isInitialized, scheduleMove, scheduleFail, scheduleVictory, scheduleLook, scheduleInitialAnimation, displayPegman]);

    const tile_SHAPES = useMemo(() => ({
        '10010': [4, 0],  // Dead ends
        '10001': [3, 3],
        '11000': [0, 1],
        '10100': [0, 2],
        '11010': [4, 1],  // Vertical
        '10101': [3, 2],  // Horizontal
        '10110': [0, 0],  // Elbows
        '10011': [2, 0],
        '11001': [4, 2],
        '11100': [2, 3],
        '11110': [1, 1],  // Junctions
        '10111': [1, 0],
        '11011': [2, 1],
        '11101': [1, 2],
        '11111': [2, 2],  // Cross
        'null0': [4, 3],  // Empty
        'null1': [3, 0],
        'null2': [3, 1],
        'null3': [0, 3],
        'null4': [1, 3],
    }), []);

    const normalize = useCallback((x, y) => {
        if (x < 0 || x >= COLS || y < 0 || y >= ROWS) {
            return '0';
        }
        return (mazeData[y][x] === 0) ? '0' : '1'; // 0 = parede, 1+ = caminho
    }, [mazeData, COLS, ROWS]);

    const createSvgElement = (tag, attributes, parent) => {
        const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'href') {
                element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', value);
            } else {
                element.setAttribute(key, value);
            }
        });
        if (parent) {
            parent.appendChild(element);
        } return element;
    };

    const drawMap = useCallback(() => {
        if (!svgRef.current || COLS === 0 || ROWS === 0) return;

        const svg = svgRef.current;
        svg.innerHTML = '';

        const scale = Math.max(ROWS, COLS) * SQUARE_SIZE;
        svg.setAttribute('viewBox', `0 0 ${scale} ${scale}`);

        createSvgElement('rect', {
            'height': MAZE_HEIGHT,
            'width': MAZE_WIDTH,
            'fill': '#F1EEE7',
            'stroke-width': 1,
            'stroke': '#CCB',
        }, svg);

        let tileId = 0;
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                let tileShape = normalize(x, y) +
                    normalize(x, y - 1) +  // North
                    normalize(x + 1, y) +  // West
                    normalize(x, y + 1) +  // South
                    normalize(x - 1, y);   // East                    

                if (!tile_SHAPES[tileShape]) {
                    if (tileShape === '00000' && Math.random() > 0.3) {
                        tileShape = 'null0';
                    } else {
                        tileShape = 'null' + Math.floor(1 + Math.random() * 4);
                    }
                }

                const left = tile_SHAPES[tileShape][0];
                const top = tile_SHAPES[tileShape][1];

                const tileClip = createSvgElement('clipPath', {
                    'id': 'tileClipPath' + tileId
                }, svg);

                createSvgElement('rect', {
                    'height': SQUARE_SIZE,
                    'width': SQUARE_SIZE,
                    'x': x * SQUARE_SIZE,
                    'y': y * SQUARE_SIZE,
                }, tileClip);

                const tile = createSvgElement('image', {
                    'height': SQUARE_SIZE * 4,
                    'width': SQUARE_SIZE * 5,
                    'clip-path': `url(#tileClipPath${tileId})`,
                    'x': (x - left) * SQUARE_SIZE,
                    'y': (y - top) * SQUARE_SIZE,
                }, svg);
                tile.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/automato/tiles_pegman.png');

                tileId++;
            }
        }

        let finishX, finishY;

        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                if (mazeData[y][x] === 3) {
                    finishX = x;
                    finishY = y;
                    break;
                }
            }
        } if (finishX !== undefined && finishY !== undefined) {
            const finishMarker = createSvgElement('image', {
                'id': 'finish',
                'height': 34,
                'width': 20,
                'x': SQUARE_SIZE * (finishX + 0.5) - 10,
                'y': SQUARE_SIZE * (finishY + 0.5) - 29,
            }, svg);
            finishMarker.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/automato/marker.png');
        }

        const pegmanClip = createSvgElement('clipPath', {
            'id': 'pegmanClipPath'
        }, svg);

        createSvgElement('rect', {
            'id': 'clipRect',
            'height': PEGMAN_HEIGHT,
            'width': PEGMAN_WIDTH,
            'x': 0,
            'y': 0,
        }, pegmanClip);

        const pegmanIcon = createSvgElement('image', {
            'id': 'pegman',
            'height': PEGMAN_HEIGHT,
            'width': PEGMAN_WIDTH * 21,  // 49 * 21 = 1029
            'clip-path': 'url(#pegmanClipPath)',
        }, svg); pegmanIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/automato/pegman.png');

        setIsInitialized(true);
    }, [mazeData, normalize, COLS, ROWS, MAZE_HEIGHT, MAZE_WIDTH, tile_SHAPES]);

    useEffect(() => {
        drawMap();
        if (playerVisible && 
            playerPosition && 
            typeof playerPosition.x === 'number' && 
            typeof playerPosition.y === 'number' && 
            typeof playerPosition.direction === 'number') {
                displayPegman(playerPosition.x, playerPosition.y, playerPosition.direction);
        }
    }, [drawMap, playerVisible, playerPosition, displayPegman]);
    useEffect(() => {
        if (isInitialized) {
            setPegmanVisibility(playerVisible);
        }
    }, [isInitialized, playerVisible, setPegmanVisibility]);

    useEffect(() => {
        if (isInitialized && playerPosition && playerVisible) {
            displayPegman(playerPosition.x, playerPosition.y, playerPosition.direction);
        }
    }, [isInitialized, playerPosition, playerVisible, displayPegman]);

    const containerStyle = {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '10px',
    };

    const svgStyle = {
        maxWidth: '100%',
        maxHeight: '100%',
        border: '2px solid #333',
        borderRadius: '8px',
        background: 'white',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    };

    return (               
        <div style={containerStyle}>
            <svg
                ref={svgRef}
                width={MAZE_WIDTH}
                height={MAZE_HEIGHT}
                style={svgStyle}
            />
        </div>
    );
}

export default MazeRenderer;