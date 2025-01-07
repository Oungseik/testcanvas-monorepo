{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    utils.url = "github:numtide/flake-utils";
  };
  outputs =
    {
      self,
      nixpkgs,
      utils,
    }:
    utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            android-tools
            android-studio
            biome
            bun
            ffmpeg
            go-ios
            openjdk21
            python3
          ];

          shellHook = '''';
          LD_LIBRARY_PATH = "${pkgs.stdenv.cc.cc.lib}/lib";
          JAVA_HOME = "${pkgs.openjdk21}/lib/openjdk";
          ANDROID_HOME = "$HOME/Android/Sdk";
        };
      }
    );
}
