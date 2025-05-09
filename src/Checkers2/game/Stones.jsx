import { Component } from 'react';
import Stone from './Stone';

class Stones extends Component {
    constructor() {
        super();
        this.state = {
            stonesInformation: [] // This is used to store the information of the stones, It will be set when the component is mounted
        };
    }

    componentDidMount() {
        // Initialize the stones positions
        this.initializeStonesPositions();
    }

    get stonesInformation() {
        const stonesInformation = this.state.stonesInformation;
        return stonesInformation
    }

    set stonesInformation(stonesInformation) {
        this.setState({
            stonesInformation
        });
    }


    initializeStonesPositions() {
        const stonesInformation = [];
        const tilesPerRow = this.props.tilesPerRow;
        const centerRow = tilesPerRow / 2;

        // Loop through the number of rows and columns to create the initial positions of the stones
        for (let row = 0; row < tilesPerRow; row++) {
            // Skip the center row and the row above the center row
            if (
                row === centerRow || 
                row === centerRow - 1
            )
                continue

            // Add the stones information to the array based on the row and column
            for (let col = 0; col < tilesPerRow; col++) {
                if ((row + col) % 2 === 0) {
                    stonesInformation.push({
                        player: row < centerRow ? 1 : 2,
                        position: [row, col]
                    });
                }
            }
        }
        this.stonesInformation = stonesInformation;
    }

    render() {
        return (
            <>
                {this.stonesInformation
                    .map((stoneInformation, key) => (
                        <Stone
                            player={stoneInformation.player}
                            position={stoneInformation.position}
                            tileDimensions={this.props.tileDimensions}
                            key={key}
                        />
                    )
                )}
            </>
        );
    }
}

export default Stones;