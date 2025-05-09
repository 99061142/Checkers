import { Component } from "react";

class Stone extends Component {
    get stoneColor() {
        const player = this.props.player;
        const stoneColor = player === 1 ? "black" : "white"; // The color of the stone is based on the player
        return stoneColor
    }

    get stoneDimensions() {
        const tileDimensions = this.props.tileDimensions;
        const stoneSize = tileDimensions.width * 0.8; // The stone size is 80% of the tile size (the width and height of the tile are the same, so it doesn't matter which one to use)
        const [row, col] = this.props.position; // Get the position of the stone from the props
        const tileWidth = tileDimensions.width
        const x = col * tileWidth + (tileWidth - stoneSize) / 2; // Center the stone in the tile
        const tileHeight = tileDimensions.height
        const y = row * tileHeight + (tileHeight - stoneSize) / 2; // Center the stone in the tile
        return {
            width: stoneSize,
            height: stoneSize,
            left: x,
            top: y
        };
    }

    render() {
        const stoneDimensions = this.stoneDimensions;
        const stoneColor = this.stoneColor;
        return (
            <div
                className="stone position-absolute rounded-circle border border-dark"
                style={{
                    backgroundColor: stoneColor,
                    width: `${stoneDimensions.width}px`,
                    height: `${stoneDimensions.height}px`,
                    left: `${stoneDimensions.left}px`,
                    top: `${stoneDimensions.top}px`,
                    boxShadow: `0 0 1px ${stoneColor}`
                }}
            >
            </div>
        )
    }
}

export default Stone;