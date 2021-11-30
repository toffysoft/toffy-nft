// //SPDX-License-Identifier: MIT

// pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract Whitelist is Ownable {
    mapping(address => bool) whitelist;
    event AddedToWhitelist(address indexed account);
    event RemovedFromWhitelist(address indexed account);

    modifier onlyWhitelisted() {
        require(isWhitelisted(msg.sender));
        _;
    }

    function add(address _address) public onlyOwner {
        whitelist[_address] = true;
        emit AddedToWhitelist(_address);
    }

    function remove(address _address) public onlyOwner {
        whitelist[_address] = false;
        emit RemovedFromWhitelist(_address);
    }

    function isWhitelisted(address _address) public view returns (bool) {
        return whitelist[_address];
    }
}

// File: contracts/Base64.sol

pragma solidity ^0.8.0;

/// [MIT License]
/// @title Base64
/// @notice Provides a function for encoding some bytes in base64
/// @author Brecht Devos <brecht@loopring.org>
library Base64 {
    bytes internal constant TABLE =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    /// @notice Encodes some bytes to the base64 representation
    function encode(bytes memory data) internal pure returns (string memory) {
        uint256 len = data.length;
        if (len == 0) return "";

        // multiply by 4/3 rounded up
        uint256 encodedLen = 4 * ((len + 2) / 3);

        // Add some extra buffer at the end
        bytes memory result = new bytes(encodedLen + 32);

        bytes memory table = TABLE;

        assembly {
            let tablePtr := add(table, 1)
            let resultPtr := add(result, 32)

            for {
                let i := 0
            } lt(i, len) {

            } {
                i := add(i, 3)
                let input := and(mload(add(data, i)), 0xffffff)

                let out := mload(add(tablePtr, and(shr(18, input), 0x3F)))
                out := shl(8, out)
                out := add(
                    out,
                    and(mload(add(tablePtr, and(shr(12, input), 0x3F))), 0xFF)
                )
                out := shl(8, out)
                out := add(
                    out,
                    and(mload(add(tablePtr, and(shr(6, input), 0x3F))), 0xFF)
                )
                out := shl(8, out)
                out := add(
                    out,
                    and(mload(add(tablePtr, and(input, 0x3F))), 0xFF)
                )
                out := shl(224, out)

                mstore(resultPtr, out)

                resultPtr := add(resultPtr, 4)
            }

            switch mod(len, 3)
            case 1 {
                mstore(sub(resultPtr, 2), shl(240, 0x3d3d))
            }
            case 2 {
                mstore(sub(resultPtr, 1), shl(248, 0x3d))
            }

            mstore(result, encodedLen)
        }

        return string(result);
    }
}

pragma solidity ^0.8.6;

library CassetteUtils {
    struct Styles {
        string _bg;
        string _head;
        string _strip1;
        string _strip2;
        string _label;
        string _body;
    }

    function compareString(string memory _str1, string memory _str2)
        public
        pure
        returns (bool)
    {
        return
            keccak256(abi.encodePacked(_str1)) ==
            keccak256(abi.encodePacked(_str2));
    }

    function getStyles(Styles memory style)
        public
        pure
        returns (string memory)
    {
        string memory styles = string(
            abi.encodePacked(
                "<style>.cls-bg{fill:",
                style._bg,
                ";}.cls-2,.cls-5{fill: ",
                style._bg,
                ";}.cls-2{opacity:0.7;}.cls-line{fill:#231f20;}.cls-4{fill:#414042;}.cls-head{fill:",
                style._head,
                ";}.cls-strip1{fill:",
                style._strip1,
                ";}.cls-strip2{fill:",
                style._strip2,
                ";}.cls-label{fill:",
                style._label,
                ";}.cls-body{fill:",
                style._body,
                ";}</style>"
            )
        );
        return styles;
    }
}

library CassetteSection1 {
    function getSection() public pure returns (string memory) {
        string[9] memory parts;
        parts[
            0
        ] = '<polygon class="cls-2" points="217.82 257.19 217.82 267.1 207.92 267.1 207.92 603.73 277.23 672.73 277.23 687.12 257.43 667.12 247.52 667.12 247.52 677.12 237.62 667.12 207.92 667.12 208.42 717.12 488.53 1000 1000 1000 1000 484.92 772.28 257.19 217.82 257.19" visibility="hidden"></polygon><rect class="cls-line" x="782.41" y="267.14" width="10.09" height="342.93"></rect><rect class="cls-line" x="762.24" y="589.9" width="10.09" height="10.09"></rect>';
        parts[
            1
        ] = '<rect class="cls-line" x="762.24" y="277.23" width="10.09" height="10.09"></rect><path class="cls-line" d="M681.55,398.26V378.09H671.47v90.78h10.08V448.7h70.6v80.68h10.09V287.31H752.15v111Zm70.6,40.34h-70.6V408.34h70.6Z"></path><rect class="cls-line" x="731.98" y="307.48" width="10.09" height="30.26"></rect><rect class="cls-line" x="268.02" y="337.74" width="463.96" height="10.1"></rect>';
        parts[
            2
        ] = '<rect class="cls-line" x="691.64" y="559.64" width="10.09" height="30.26"></rect><polygon class="cls-line" points="711.81 589.9 701.72 589.9 701.72 610.07 298.28 610.07 298.28 589.9 288.19 589.9 288.19 610.07 217.59 610.07 217.59 620.15 782.41 620.15 782.41 610.07 711.81 610.07 711.81 589.9"></polygon><rect class="cls-line" x="661.38" y="579.81" width="10.09" height="10.09"></rect>';
        parts[
            3
        ] = '<rect class="cls-line" x="651.29" y="589.9" width="10.1" height="10.09"></rect><rect class="cls-line" x="651.29" y="569.73" width="10.1" height="10.09"></rect><rect class="cls-line" x="328.53" y="468.87" width="342.94" height="10.09"></rect><rect class="cls-line" x="651.29" y="408.34" width="10.1" height="30.26"></rect><rect class="cls-line" x="641.2" y="579.81" width="10.09" height="10.09"></rect>';
        parts[
            4
        ] = '<rect class="cls-line" x="641.2" y="438.6" width="10.09" height="10.1"></rect><rect class="cls-line" x="641.2" y="398.26" width="10.09" height="10.09"></rect><rect class="cls-line" x="610.95" y="448.7" width="30.26" height="10.09"></rect><rect class="cls-line" x="610.95" y="388.17" width="30.26" height="10.09"></rect><rect class="cls-line" x="600.86" y="569.73" width="10.09" height="20.17"></rect>';
        parts[
            5
        ] = '<rect class="cls-line" x="600.86" y="438.6" width="10.09" height="10.1"></rect><rect class="cls-line" x="600.86" y="398.26" width="10.09" height="10.09"></rect><rect class="cls-line" x="580.69" y="559.64" width="20.17" height="10.09"></rect><rect class="cls-line" x="590.78" y="408.34" width="10.09" height="30.26"></rect><rect class="cls-line" x="580.69" y="589.9" width="20.17" height="10.09"></rect>';
        parts[
            6
        ] = '<rect class="cls-line" x="570.61" y="569.73" width="10.09" height="20.17"></rect><path class="cls-line" d="M429.39,458.78H570.61V388.17H429.39Zm10.09-60.52h20.18v10.08h10.08V398.26h60.52v10.08h10.08V398.26h20.18V448.7H540.34V438.6H530.26v10.1H469.74V438.6H459.66v10.1H439.48Z"></path><rect class="cls-line" x="520.17" y="408.34" width="10.09" height="30.26"></rect>';
        parts[
            7
        ] = '<rect class="cls-line" x="469.74" y="408.34" width="10.09" height="30.26"></rect><rect class="cls-line" x="419.31" y="569.73" width="10.09" height="20.17"></rect><rect class="cls-line" x="399.14" y="559.64" width="20.17" height="10.09"></rect><rect class="cls-line" x="399.14" y="589.9" width="20.17" height="10.09"></rect><rect class="cls-line" x="399.14" y="408.34" width="10.09" height="30.26"></rect>';
        parts[
            8
        ] = '<rect class="cls-line" x="389.05" y="569.73" width="10.09" height="20.17"></rect><rect class="cls-line" x="389.05" y="438.6" width="10.09" height="10.1"></rect><rect class="cls-line" x="389.05" y="398.26" width="10.09" height="10.09"></rect><rect class="cls-line" x="358.8" y="448.7" width="30.26" height="10.09"></rect><rect class="cls-line" x="358.8" y="388.17" width="30.26" height="10.09"></rect>';
        string memory output = string(
            abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4])
        );
        output = string(
            abi.encodePacked(output, parts[5], parts[6], parts[7], parts[8])
        );
        return output;
    }
}

library CassetteSection2 {
    function getSection() public pure returns (string memory) {
        string[9] memory parts;
        parts[
            0
        ] = '<rect class="cls-line" x="348.7" y="579.81" width="10.1" height="10.09"></rect><rect class="cls-line" x="348.7" y="438.6" width="10.1" height="10.1"></rect><rect class="cls-line" x="348.7" y="398.26" width="10.1" height="10.09"></rect><rect class="cls-line" x="338.62" y="589.9" width="10.09" height="10.09"></rect><rect class="cls-line" x="338.62" y="569.73" width="10.09" height="10.09"></rect>';
        parts[
            1
        ] = '<rect class="cls-line" x="338.62" y="408.34" width="10.09" height="30.26"></rect><rect class="cls-line" x="328.53" y="368" width="342.94" height="10.09"></rect><rect class="cls-line" x="328.53" y="579.81" width="10.09" height="10.09"></rect><rect class="cls-line" x="318.45" y="317.57" width="363.11" height="10.09"></rect>';
        parts[
            2
        ] = '<polygon class="cls-line" points="318.45 539.46 681.55 539.46 681.55 559.64 691.64 559.64 691.64 539.46 752.15 539.46 752.15 529.38 247.84 529.38 247.84 539.46 308.36 539.46 308.36 559.64 318.45 559.64 318.45 539.46"></polygon><rect class="cls-line" x="298.28" y="559.64" width="10.09" height="30.26"></rect><rect class="cls-line" x="268.02" y="297.4" width="463.96" height="10.09"></rect>';
        parts[
            3
        ] = '<rect class="cls-line" x="257.94" y="307.48" width="10.09" height="30.26"></rect><polygon class="cls-line" points="742.06 287.31 752.15 287.31 752.15 277.23 247.84 277.23 247.84 287.31 257.94 287.31 742.06 287.31"></polygon><path class="cls-line" d="M318.45,448.7v20.17h10.08V378.09H318.45v20.17H247.84V287.31H237.76V529.38h10.08V448.7Zm-70.61-40.36h70.61V438.6H247.84Z"></path>';
        parts[
            4
        ] = '<rect class="cls-line" x="227.67" y="589.9" width="10.09" height="10.09"></rect><rect class="cls-line" x="227.67" y="277.23" width="10.09" height="10.09"></rect><rect class="cls-line" x="217.59" y="257.06" width="564.83" height="10.09"></rect><rect class="cls-line" x="207.5" y="267.14" width="10.09" height="342.93"></rect>';
        parts[
            5
        ] = '<polygon class="cls-4" points="540.34 398.26 540.34 408.34 530.25 408.34 530.25 438.6 540.34 438.6 540.34 448.69 560.52 448.69 560.52 398.26 540.34 398.26"></polygon><polygon class="cls-4" points="459.66 398.26 439.48 398.26 439.48 448.69 459.66 448.69 459.66 438.6 469.75 438.6 469.75 408.34 459.66 408.34 459.66 398.26"></polygon>';
        parts[
            6
        ] = '<polygon class="cls-5" points="469.75 398.26 469.75 408.34 479.83 408.34 479.83 438.6 469.75 438.6 469.75 448.69 530.25 448.69 530.25 438.6 520.17 438.6 520.17 408.34 530.25 408.34 530.25 398.26 469.75 398.26"></polygon><polygon class="cls-5" points="651.29 408.34 641.2 408.34 641.2 398.26 610.95 398.26 610.95 408.34 600.86 408.34 600.86 438.6 610.95 438.6 610.95 448.69 641.2 448.69 641.2 438.6 651.29 438.6 651.29 408.34"></polygon>';
        parts[
            7
        ] = '<rect class="cls-5" x="580.69" y="569.73" width="20.17" height="20.17"></rect><rect class="cls-5" x="399.14" y="569.73" width="20.17" height="20.17"></rect><polygon class="cls-5" points="399.14 408.34 389.05 408.34 389.05 398.26 358.8 398.26 358.8 408.34 348.7 408.34 348.7 438.6 358.8 438.6 358.8 448.69 389.05 448.69 389.05 438.6 399.14 438.6 399.14 408.34"></polygon>';
        parts[
            8
        ] = '<path class="cls-head" d="M732,337.74V307.48H268v30.26ZM318.45,327.65V317.57h363.1v10.08Z"></path><rect class="cls-head" x="651.29" y="579.81" width="10.1" height="10.09"></rect><rect class="cls-head" x="338.62" y="579.81" width="10.09" height="10.09"></rect><rect class="cls-strip1" x="681.55" y="428.51" width="70.6" height="10.09"></rect>';
        string memory output = string(
            abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4])
        );
        output = string(
            abi.encodePacked(output, parts[5], parts[6], parts[7], parts[8])
        );
        return output;
    }
}

library CassetteSection3 {
    function getSection() public pure returns (string memory) {
        string[9] memory parts;
        parts[
            0
        ] = '<rect class="cls-strip1" x="247.84" y="428.51" width="70.61" height="10.09"></rect><rect class="cls-strip2" x="681.55" y="418.43" width="70.6" height="10.09"></rect>';
        parts[
            1
        ] = '<rect class="cls-strip2" x="247.84" y="418.43" width="70.61" height="10.09"></rect>';
        parts[
            2
        ] = '<path class="cls-label" d="M247.84,287.31v111h70.61V378.09h10.08V368H671.47v10.09h10.08v20.17h70.6V287.31Zm494.22,50.43H732v10.09H268V337.74H257.94V307.48H268V297.4H732v10.08h10.08Z"></path>';
        parts[
            3
        ] = '<polygon class="cls-label" points="681.55 448.69 681.55 468.87 671.47 468.87 671.47 478.95 328.53 478.95 328.53 468.87 318.45 468.87 318.45 448.69 247.84 448.69 247.84 529.38 752.15 529.38 752.15 448.69 681.55 448.69"></polygon>';
        parts[
            4
        ] = '<rect class="cls-body" x="681.55" y="408.34" width="70.6" height="10.09"></rect>';
        parts[
            5
        ] = '<path class="cls-body" d="M328.53,378.09v90.78H671.47V378.09Zm30.27,80.69V448.7H348.7V438.6H338.62V408.34H348.7V398.26h10.1V388.17h30.25v10.09h10.09v10.08h10.08V438.6H399.14v10.1H389.05v10.08Zm70.59,0V388.17H570.61v70.61Zm232-20.18H651.29v10.1H641.2v10.08H611V448.7H600.86V438.6H590.78V408.34h10.08V398.26H611V388.17H641.2v10.09h10.09v10.08h10.09Z"></path>';
        parts[
            6
        ] = '<path class="cls-body" d="M701.72,610.07V589.9H691.64V559.64H681.55V539.46H318.45v20.18H308.36V589.9H298.28v20.17ZM651.29,600V589.9H641.2V579.81h10.09V569.73h10.09v10.08h10.09V589.9H661.38V600Zm-312.67,0V589.9H328.53V579.81h10.09V569.73H348.7v10.08h10.1V589.9H348.7V600Zm60.52,0V589.9H389.05V569.73h10.09V559.64h20.17v10.09h10.08V589.9H419.31V600Zm181.55,0V589.9H570.61V569.73h10.08V559.64h20.17v10.09H611V589.9H600.86V600Z"></path>';
        parts[
            7
        ] = '<rect class="cls-body" x="247.84" y="408.34" width="70.61" height="10.09"></rect>';
        parts[
            8
        ] = '<path class="cls-body" d="M298.28,559.64h10.08V539.46H247.84V529.38H237.76V287.31H227.67V277.23h10.09v10.08h10.08V277.23H752.15v10.08h10.09V277.23h10.09v10.08H762.24V529.38H752.15v10.08H691.64v20.18h10.08V589.9h10.09v20.17h70.6V267.14H217.59V610.07h70.6V589.9h10.09ZM772.33,600H762.24V589.9h10.09Zm-544.66,0V589.9h10.09V600Z"></path>';
        string memory output = string(
            abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4])
        );
        output = string(
            abi.encodePacked(output, parts[5], parts[6], parts[7], parts[8])
        );
        return output;
    }
}

contract CassetteFactory is
    ERC721Enumerable,
    ReentrancyGuard,
    Ownable,
    Whitelist
{
    mapping(uint256 => uint256) public minted;

    string[] private colors = [
        "#00ADB5",
        "#F9ED69",
        "#F08A5D",
        "#B83B5E",
        "#6A2C70",
        "#F38181",
        "#FCE38A",
        "#EAFFD0",
        "#95E1D3",
        "#08D9D6",
        "#FF2E63",
        "#53354A",
        "#903749",
        "#E84545",
        "#A7FF83",
        "#17B978",
        "#086972",
        "#94FC13",
        "#1df900",
        "#325288",
        "#FF165D",
        "#FF9A00",
        "#F6F7D7",
        "#3EC1D3",
        "#ace7ff",
        "#fff",
        "#1edfe2",
        "#755cff",
        "#fef55a",
        "#ff40fe"
    ];

    string[] private genre = [
        "Pop",
        "Rock",
        "R&B",
        "Blues",
        "Jazz",
        "Soul",
        "Funk",
        "Disco",
        "EDM",
        "Reggae",
        "Ska"
    ];

    function getBgColor(uint256 tokenId) internal view returns (string memory) {
        return pluck(tokenId, "BACKGROUND", colors);
    }

    function getHeadColor(uint256 tokenId)
        internal
        view
        returns (string memory)
    {
        return pluck(tokenId, "HEAD", colors);
    }

    function getStrip1Color(uint256 tokenId)
        internal
        view
        returns (string memory)
    {
        return pluck(tokenId, "STRIP1", colors);
    }

    function getStrip2Color(uint256 tokenId)
        internal
        view
        returns (string memory)
    {
        return pluck(tokenId, "STRIP2", colors);
    }

    function getLabelColor(uint256 tokenId)
        internal
        view
        returns (string memory)
    {
        return pluck(tokenId, "LABEL", colors);
    }

    function getBodyColor(uint256 tokenId)
        internal
        view
        returns (string memory)
    {
        return pluck(tokenId, "BODY", colors);
    }

    function getGenre(uint256 tokenId) internal view returns (string memory) {
        return pluck(tokenId, "GENRE", genre);
    }

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    function pluck(
        uint256 tokenId,
        string memory prefix,
        string[] memory sourceArray
    ) internal view returns (string memory) {
        uint256 rand = random(
            string(abi.encodePacked(prefix, toString(tokenId), address(this)))
        );
        string memory output = sourceArray[rand % sourceArray.length];

        return output;
    }

    function isMinted(uint256 tokenId) internal returns (bool) {
        if (minted[tokenId] == 0) {
            minted[tokenId] = 1;
            return true;
        } else {
            return false;
        }
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        string[9] memory parts;

        parts[
            0
        ] = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" style="zoom: 1;">';
        parts[1] = "<defs>";
        parts[2] = CassetteUtils.getStyles(
            CassetteUtils.Styles(
                getBgColor(tokenId),
                getHeadColor(tokenId),
                getStrip1Color(tokenId),
                getStrip2Color(tokenId),
                getLabelColor(tokenId),
                getBodyColor(tokenId)
            )
        );
        parts[3] = "</defs>";
        parts[4] = string(
            abi.encodePacked(
                "<title>cassette-vol-",
                toString(tokenId),
                "</title>"
            )
        );
        parts[
            5
        ] = '<g id="Background" visibility="visible"><rect id="color" class="cls-bg" width="1000" height="1000" visibility="visible"></rect></g>';

        parts[6] = string(
            abi.encodePacked(
                '<g id="Cassette" visibility="visible">',
                CassetteSection1.getSection(),
                CassetteSection2.getSection(),
                CassetteSection3.getSection(),
                "</g>"
            )
        );
        parts[7] = '<g id="Text" visibility="hidden"></g>';
        parts[8] = "</svg>";

        string memory output = string(
            abi.encodePacked(
                parts[0],
                parts[1],
                parts[2],
                parts[3],
                parts[4],
                parts[5]
            )
        );
        output = string(abi.encodePacked(output, parts[6], parts[7], parts[8]));

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Cassette #',
                        toString(tokenId),
                        '", "description": "Cassette is the NFT project of TOFFYSOFT, for random Cassette generated and stored on chain. (Loot project random Style), use it as avatar or any way you want !", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(output)),
                        '", "attributes": [ { "trait_type": "background", "value": "',
                        getBgColor(tokenId),
                        '"}, { "trait_type": "genre", "value": "',
                        getGenre(tokenId),
                        '"} ]}'
                    )
                )
            )
        );
        output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
        return output;
    }

    function claim(uint256 tokenId) public nonReentrant onlyWhitelisted {
        require(tokenId > 0 && tokenId < 11, "Token ID invalid");
        require(isMinted(tokenId), "this token is minted!");
        require(
            balanceOf(msg.sender) == 0,
            "Each address may only own one square"
        );
        _safeMint(_msgSender(), tokenId);
    }

    function toString(uint256 value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT license
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    constructor() ERC721("Toffy Cassette NFTs", "CASSETTE") Ownable() {}
}
