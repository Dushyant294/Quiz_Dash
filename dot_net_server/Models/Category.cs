using System.Text.Json.Serialization;

namespace dot_net_server.Models;

public class Category
{
    [JsonPropertyName("category_id")]
    public int CategoryId { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("gradient_from")]
    public string? GradientFrom { get; set; }

    [JsonPropertyName("gradient_to")]
    public string? GradientTo { get; set; }

    [JsonPropertyName("border_color")]
    public string? BorderColor { get; set; }

    [JsonPropertyName("sort_order")]
    public int SortOrder { get; set; }

    [JsonPropertyName("is_active")]
    public bool IsActive { get; set; } = true;
}

public class Subject
{
    [JsonPropertyName("subject_id")]
    public int SubjectId { get; set; }

    [JsonPropertyName("category_id")]
    public int CategoryId { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
}

public class Topic
{
    [JsonPropertyName("topic_id")]
    public int TopicId { get; set; }

    [JsonPropertyName("subject_id")]
    public int SubjectId { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
}

public class MicroTopic
{
    [JsonPropertyName("micro_topic_id")]
    public int MicroTopicId { get; set; }

    [JsonPropertyName("topic_id")]
    public int TopicId { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
}