This repository contains code and tools for to generatel ics und webcal feeds for the waste collection services in Aarau. See [the frontend on github.io](https://mweyland.github.io/entsorgung-aarau/) for an explanation and for the frontend in action.

The frontend stored in `docs` is used to select regions and services of interest and is delivered via [github.io](https://mweyland.github.io/entsorgung-aarau/). The backend is running as google cloud service where `main.py` is executed when the webcal link generated by the frontend is called. `requirements.txt` contain the requirements for the cloud build environment; collection events are stored in `aarau_entsorgung_2025.json`. Deployment to the Google cloud service is triggered by merging into the `deploy` branch.

The project is licensed under the [GNU Affero General Public License v3.0](https://www.gnu.org/licenses/agpl-3.0.en.html).
