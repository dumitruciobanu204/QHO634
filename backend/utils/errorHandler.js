export function handleError(res, error, message) {
    console.error(`[ERROR]: ${message} - ${error.message}`);
    res.status(500).json({ error: message });
}
