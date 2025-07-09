import React, { useEffect, useRef, useCallback } from 'react';

export function BeeRenderer({ 
    currentPhaseData, 
    beePosition, 
    beeVisible = true,
    hasNectar = false,
    gameState 
}) {
    const svgRef = useRef(null);
    const animationTimeouts = useRef([]);

    const MAP_SIZE = 400;
    const BEE_SIZE = 20;
    const FLOWER_SIZE = 24;
    const HIVE_SIZE = 30;

    const clearAnimations = useCallback(() => {
        animationTimeouts.current.forEach(timeout => clearTimeout(timeout));
        animationTimeouts.current = [];
    }, []);

    const createSvgElement = useCallback((tag, attributes, parent) => {
        const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        if (parent) {
            parent.appendChild(element);
        }
        return element;
    }, []);

    const drawMap = useCallback(() => {
        if (!svgRef.current || !currentPhaseData) return;

        const svg = svgRef.current;
        svg.innerHTML = '';

        // Fundo
        createSvgElement('rect', {
            'width': MAP_SIZE,
            'height': MAP_SIZE,
            'fill': '#87CEEB', // Azul céu
            'stroke': '#4682B4',
            'stroke-width': 2
        }, svg);

        // Desenhar paredes
        if (currentPhaseData.walls) {
            currentPhaseData.walls.forEach(wall => {
                createSvgElement('line', {
                    'x1': (wall.x1 / 100) * MAP_SIZE,
                    'y1': (wall.y1 / 100) * MAP_SIZE,
                    'x2': (wall.x2 / 100) * MAP_SIZE,
                    'y2': (wall.y2 / 100) * MAP_SIZE,
                    'stroke': '#8B4513',
                    'stroke-width': 8,
                    'stroke-linecap': 'round'
                }, svg);
            });
        }

        // Desenhar flor única
        if (currentPhaseData.flower) {
            const flowerGroup = createSvgElement('g', {
                'transform': `translate(${(currentPhaseData.flower.x / 100) * MAP_SIZE - FLOWER_SIZE/2}, ${(currentPhaseData.flower.y / 100) * MAP_SIZE - FLOWER_SIZE/2})`
            }, svg);

            // Pétalas
            createSvgElement('circle', {
                'cx': FLOWER_SIZE/2,
                'cy': FLOWER_SIZE/2,
                'r': FLOWER_SIZE/2,
                'fill': '#FF69B4',
                'stroke': '#FF1493',
                'stroke-width': 2
            }, flowerGroup);

            // Centro
            createSvgElement('circle', {
                'cx': FLOWER_SIZE/2,
                'cy': FLOWER_SIZE/2,
                'r': FLOWER_SIZE/4,
                'fill': '#FFD700'
            }, flowerGroup);
        }

        // Desenhar múltiplas flores
        if (currentPhaseData.flowers) {
            currentPhaseData.flowers.forEach((flower, index) => {
                const flowerGroup = createSvgElement('g', {
                    'id': `flower-${index}`,
                    'transform': `translate(${(flower.x / 100) * MAP_SIZE - FLOWER_SIZE/2}, ${(flower.y / 100) * MAP_SIZE - FLOWER_SIZE/2})`
                }, svg);

                // Pétalas
                createSvgElement('circle', {
                    'cx': FLOWER_SIZE/2,
                    'cy': FLOWER_SIZE/2,
                    'r': FLOWER_SIZE/2,
                    'fill': '#FF69B4',
                    'stroke': '#FF1493',
                    'stroke-width': 2
                }, flowerGroup);

                // Centro
                createSvgElement('circle', {
                    'cx': FLOWER_SIZE/2,
                    'cy': FLOWER_SIZE/2,
                    'r': FLOWER_SIZE/4,
                    'fill': '#FFD700'
                }, flowerGroup);
            });
        }

        // Desenhar colmeia
        if (currentPhaseData.hive) {
            const hiveGroup = createSvgElement('g', {
                'transform': `translate(${(currentPhaseData.hive.x / 100) * MAP_SIZE - HIVE_SIZE/2}, ${(currentPhaseData.hive.y / 100) * MAP_SIZE - HIVE_SIZE/2})`
            }, svg);

            // Corpo da colmeia
            createSvgElement('rect', {
                'x': 0,
                'y': HIVE_SIZE/4,
                'width': HIVE_SIZE,
                'height': HIVE_SIZE * 0.75,
                'fill': '#DAA520',
                'stroke': '#B8860B',
                'stroke-width': 2,
                'rx': 4
            }, hiveGroup);

            // Entrada
            createSvgElement('circle', {
                'cx': HIVE_SIZE/2,
                'cy': HIVE_SIZE * 0.6,
                'r': HIVE_SIZE/6,
                'fill': '#8B4513'
            }, hiveGroup);
        }

        // Desenhar abelha
        if (beeVisible && beePosition) {
            const beeGroup = createSvgElement('g', {
                'id': 'bee',
                'transform': `translate(${(beePosition.x / 100) * MAP_SIZE - BEE_SIZE/2}, ${(beePosition.y / 100) * MAP_SIZE - BEE_SIZE/2}) rotate(${beePosition.angle}, ${BEE_SIZE/2}, ${BEE_SIZE/2})`
            }, svg);

            // Corpo da abelha
            createSvgElement('ellipse', {
                'cx': BEE_SIZE/2,
                'cy': BEE_SIZE/2,
                'rx': BEE_SIZE/3,
                'ry': BEE_SIZE/2,
                'fill': '#FFD700',
                'stroke': '#FFA500',
                'stroke-width': 1
            }, beeGroup);

            // Listras
            createSvgElement('rect', {
                'x': BEE_SIZE/2 - BEE_SIZE/6,
                'y': BEE_SIZE/2 - BEE_SIZE/4,
                'width': BEE_SIZE/3,
                'height': 2,
                'fill': '#000000'
            }, beeGroup);

            createSvgElement('rect', {
                'x': BEE_SIZE/2 - BEE_SIZE/6,
                'y': BEE_SIZE/2 + BEE_SIZE/8,
                'width': BEE_SIZE/3,
                'height': 2,
                'fill': '#000000'
            }, beeGroup);

            // Asas
            createSvgElement('ellipse', {
                'cx': BEE_SIZE/2 - BEE_SIZE/4,
                'cy': BEE_SIZE/2 - BEE_SIZE/4,
                'rx': BEE_SIZE/6,
                'ry': BEE_SIZE/8,
                'fill': '#FFFFFF',
                'stroke': '#CCCCCC',
                'stroke-width': 1,
                'opacity': 0.7
            }, beeGroup);

            createSvgElement('ellipse', {
                'cx': BEE_SIZE/2 + BEE_SIZE/4,
                'cy': BEE_SIZE/2 - BEE_SIZE/4,
                'rx': BEE_SIZE/6,
                'ry': BEE_SIZE/8,
                'fill': '#FFFFFF',
                'stroke': '#CCCCCC',
                'stroke-width': 1,
                'opacity': 0.7
            }, beeGroup);

            // Indicador de néctar
            if (hasNectar) {
                createSvgElement('circle', {
                    'cx': BEE_SIZE/2,
                    'cy': BEE_SIZE/2 - BEE_SIZE/3,
                    'r': 3,
                    'fill': '#FF69B4',
                    'stroke': '#FF1493',
                    'stroke-width': 1
                }, beeGroup);
            }
        }
    }, [currentPhaseData, beePosition, beeVisible, hasNectar, createSvgElement]);

    useEffect(() => {
        drawMap();
        return () => clearAnimations();
    }, [drawMap, clearAnimations]);

    const containerStyle = {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        background: 'linear-gradient(135deg, #87CEEB 0%, #98FB98 100%)',
        borderRadius: '10px'
    };

    const svgStyle = {
        maxWidth: '100%',
        maxHeight: '100%',
        border: '2px solid #333',
        borderRadius: '8px',
        background: 'white',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
    };

    return (
        <div style={containerStyle}>
            <svg
                ref={svgRef}
                width={MAP_SIZE}
                height={MAP_SIZE}
                style={svgStyle}
                viewBox={`0 0 ${MAP_SIZE} ${MAP_SIZE}`}
            />
        </div>
    );
}

export default BeeRenderer;
