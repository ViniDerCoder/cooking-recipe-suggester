import onInterval from "../../utils/listener/interval";

onInterval('redoSuggestions', 60 * 24, async () => {
    console.log('Redoing suggestions');
}, new Date().setHours(0, 0, 0, 0));