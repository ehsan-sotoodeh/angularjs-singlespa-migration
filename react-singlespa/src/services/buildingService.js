import { del, get, post, patch } from "../helpers/api_helper";

import { forkJoin } from "rxjs";

export const addBuildingsUser = async (params) => {
  const response = await post("building/user", params)
    .then((r) => {
      return {
        succeeded: r.success,
        data: {
          buildingIds: r.doc_ids,
          user: r.docs[0],
          permission: {
            user: r.docs[0]._id,
            role: { name: params.role },
          },
        },
        error: r.error,
      };
    })
    .catch((e) => {
      return { succeeded: false, data: [], error: e.response };
    });
  return response;
};

export const getBuildingById = async (buildingId) => {
  return await get("building", { params: { building_ids: [buildingId] } });
};


export const editPermissions = async (params) => {
  const response = await patch("building/permission", params)
    .then((r) => {
      return { succeeded: true, data: r.docs };
    })
    .catch((e) => {
      return { succeeded: false, error: e.response };
    });
  return response;
};

export const inviteUserToBuilding = async (params) => {
  const response = await post("user/building_invite", params)
    .then((r) => {
      return { succeeded: true, data: r.docs };
    })
    .catch((e) => {
      return { succeeded: false, error: e.response };
    });
  return response;
};

export const getAccountBuildings = async (account) => {
  //TODO: better to write an end point to get account id and send all buildings back. (if updating get account was not in the plan)
  return new Promise((resolve) => {
    let q = account.buildings.map((b) => {
      return get("building", { headers: { building_ids: b } });
    });
    let buildings = [];
    if (q.length === 0) {
              console.log("first ",buildings);

      resolve({ succeeded: true, data: buildings });
    }
    forkJoin(q).subscribe(
      (response) => {
        for (let r of response) {
          if (r.docs) {
            buildings.push(r.docs[0]);
          }
        }
                console.log("middle ",buildings);

        resolve({ succeeded: true, data: buildings });
      },
      (e) => {
        console.log("last ",buildings);
        resolve({
          succeeded: false,
          data: buildings,
          error: e.response || e.message,
        });
      }
    );
  });
};

export const updateBuilding = async (building) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return building;
};

export const createBuilding = async (building) => {
  const response = await post("building", building)
    .then((r) => {
      return { succeeded: r.success, data: r.docs[0], error: r.error };
    })
    .catch((e) => {
      return { succeeded: false, data: {}, error: e.response };
    });
  return response;
};

export const moveBuildings = async (source, destination, building_ids) => {
  const response = await patch("account/move_buildings", {
    source,
    destination,
    building_ids,
  })
    .then((r) => {
      return { succeeded: r.success, data: r.docs[0] };
    })
    .catch((e) => {
      return { succeeded: false, error: e.response, data: {} };
    });
  return response;
};

export const deleteBuildings = async (building_ids) => {
  return new Promise((resolve) => {
    let promises = building_ids.map((b_id) => {
      return del("building", { headers: { building_id: b_id } });
    });
    Promise.allSettled(promises).then((results) => {
      const response = results.map((result) => {
        if (result.status === "fulfilled") {
          return { succeeded: true, data: result.value };
        } else {
          return {
            succeeded: false,
            error:
              result?.reason?.response?.data?.error || result?.reason?.message,
            data: result?.reason?.response?.data || { doc_ids: [] },
          };
        }
      });
      resolve({ succeeded: true, data: response });
    });
  });
};
