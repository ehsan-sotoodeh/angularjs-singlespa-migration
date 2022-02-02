import { post } from "../helpers/api_helper";

export const saveLog = async (log) => {
  const response = await post("log", log)
    .then((r) => {
      return { succeeded: r.success, data: r.doc_ids, error: r.error };
    })
    .catch((e) => {
      return { succeeded: false, data: [], error: e.response };
    });
  return response;
};
