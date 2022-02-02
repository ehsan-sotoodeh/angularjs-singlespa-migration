import { BehaviorSubject } from "rxjs";

export const auth$ = new BehaviorSubject({
  errorMessage: null,
  authCode: 200,
  pending: false,
  currentUser: {
    success: true,
    error: null,
    doc_ids: ["q21n1twfkzbiffzrp9ge5dhy"],
    docs: [
      {
        _id: "q21n1twfkzbiffzrp9ge5dhy",
        _cls: "User",
        email: "test@test.com",
        first_name: "test name",
        last_name: "test lastname",
        email_verified: false,
        phone_verified: false,
        country: "CA",
        language: "en",
        time_zone: "UTC +8",
        blocked: false,
        login_history: [],
        created_on_utc: "2021-12-15T01:12:11.524145",
        modified_on_utc: "2021-12-15T01:12:11.524175",
        pending: false,
      },
    ],
  },
  accessToken:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
});
