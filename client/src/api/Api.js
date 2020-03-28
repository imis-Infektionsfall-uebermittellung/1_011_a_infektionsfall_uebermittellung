
const METHOD = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE"
};

class Api {
    constructor() {
        if (
            location.host.includes("localhost") ||
            location.host.includes("127.0.0.1")
        ) {
            this.BASE_URL = "http://localhost:80";
            // Alternative config to run the app locally without root; see proxy conf
            // this.BASE_URL = "http://localhost:8080/api";
        } else {
            this.BASE_URL = "http://35.246.194.158:8080";
        }
    }

    executeRequest(url, method, body) {
        let authHeaders = {};
        // if (!publicRoutes.includes(url)) {
        //     authHeaders = authenticationStore.getAuthHeader();
        // }
        const options = {
            method: method,
            headers: {
                "Content-Type": "application/json",
                ...authHeaders
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        return fetch(encodeURI(`${this.BASE_URL}/${url}`), options).then(
            response => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.error(response);
                    // reject so error object (e.g. for status code) can be used by caller
                    return Promise.reject(response);
                }
            }
        );
    }

    /*
     * -----------IMPLEMENTED IN UI-----------
     */

    postInstitution(request) {
        return this.executeRequest("auth/register", METHOD.POST, request);
    }

    postPatient(request) {
        return this.executeRequest("patients", METHOD.POST, request);
    }

    postLabTest(request) {
        return this.executeRequest("labtests", METHOD.POST, request);
    }

    putLabTest(laboratoryId, request) {
        return this.executeRequest(`labtests/${laboratoryId}`, METHOD.PUT, request);
    }

    postAuthentication(request) {
        return this.executeRequest("auth", METHOD.POST, request);
    }

    /*
     * ---------NOT IMPLEMENTED IN UI---------
     */

    postDoctorCreateAppointment({doctorId, laboratoryId, patientId}) {
        return this.executeRequest("doctor/create_appointment", METHOD.POST, {
            doctorId,
            laboratoryId,
            patientId
        });
    }

    getLabTestByPatient(patientId) {
        return this.executeRequest(`labtest/patient/${patientId}`, METHOD.GET);
    }

    getPatients() {
        return this.executeRequest("patients", METHOD.GET);
    }

    getPatient(id) {
        return this.executeRequest(`patients/${id}`, METHOD.GET);
    }

    getStats(lowerBoundsZip, upperBoundsZip) {
        return this.executeRequest(
            `stats?lowerBoundsZip=${lowerBoundsZip}&upperBoundsZips=${upperBoundsZip}`,
            METHOD.GET
        );
    }
}

export default new Api();
