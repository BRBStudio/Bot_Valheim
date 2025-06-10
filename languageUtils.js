const Language = require('./schemas/languageSchema');

async function getPreferredLanguage(guildId, userId) {
    const languageData = await Language.findOne({ guildId, userId });
    return languageData ? languageData.preferredLanguage : 'vi';
}

async function setPreferredLanguage(guildId, userId, language) {
    let languageData = await Language.findOne({ guildId, userId });
    if (!languageData) {
        languageData = new Language({ guildId, userId, preferredLanguage: language });
    } else {
        languageData.preferredLanguage = language;
    }
    await languageData.save();
}

module.exports = { getPreferredLanguage, setPreferredLanguage };

// announce.js
