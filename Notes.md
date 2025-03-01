# NOTES

## FORMAT

for Communication between Frontend and Backend

After connection is established-

<!-- TODO: To be implemented -->

1. **CLIENT** -> **SERVER**

    ``` json
    {
        "type": "hello",
        "username": "uc",
        "accessToken": "Client JWT Access Token"
    }
    ```

    server authenticates, if invalid token, server sends error message.

    ``` json
    {
        "type": "error",
        "message": "Invalid Access Token"
    }
    ```
    

## CSS Classes

- **msg-container** 'div'
  1. `message`
  2. `outgoing-msg` | `incoming-msg`

  ### Children

    1. **msg-sender-header** 'div' `msg-sender`

    2. **msg-content-text** 'div' `msg-content`

    3. **msg-time-text** 'div' `msg-time`

- **contact** 'div'
<!-- TODO: Add contact div classes -->
