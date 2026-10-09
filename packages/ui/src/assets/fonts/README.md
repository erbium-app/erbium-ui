# Shared fonts

Cal Sans 2.0 variable fonts, reused from coss UI’s shared fonts. Upstream: https://github.com/calcom/sans. Unmodified normal and italic WOFF2 files are licensed under the SIL Open Font License 1.1; see [OFL.txt](./OFL.txt).

Vazirmatn’s Arabic variable subset is vendored from Fontsource with its SIL Open Font License; see [Vazirmatn-OFL.txt](./Vazirmatn-OFL.txt).

Paper Mono’s variable WOFF2 is vendored unmodified from [paper-design/paper-mono](https://github.com/paper-design/paper-mono/tree/e6eaeceaef02e77e3db997711e07a16378de2bd7), with weights 100–800 and its SIL Open Font License; see [PaperMono-OFL.txt](./PaperMono-OFL.txt).

The shared fonts.css defines script-aware faces for all applications. Workspace builds use local assets; the registry generator references separately hosted WOFF2 files in published fonts.css and includes all three licenses.
