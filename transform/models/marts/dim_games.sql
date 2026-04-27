with games as (
    select * from {{ ref('stg_games') }}
),

final as (
    select
        app_id,
        name,
        developer,
        publisher,
        is_free,
        price_usd::numeric as price_usd,
        release_date,
        coming_soon,
        header_image,
        short_description,
        metacritic_score,
        recommendations,
        owners,
        positive_reviews,
        negative_reviews,
        avg_playtime_hrs,
        median_playtime_hrs,
        ccu as current_players,
        case
            when positive_reviews + negative_reviews = 0 then null
            else round(
                positive_reviews::numeric / 
                (positive_reviews + negative_reviews) * 100, 1
            )
        end as positive_pct,
        case
            when positive_reviews + negative_reviews >= 500 and
                round(positive_reviews::numeric / (positive_reviews + negative_reviews) * 100, 1) >= 95
                then 'Overwhelmingly Positive'
            when positive_reviews + negative_reviews >= 50 and
                round(positive_reviews::numeric / (positive_reviews + negative_reviews) * 100, 1) >= 80
                then 'Very Positive'
            when positive_reviews + negative_reviews >= 50 and
                round(positive_reviews::numeric / (positive_reviews + negative_reviews) * 100, 1) >= 70
                then 'Mostly Positive'
            when positive_reviews + negative_reviews >= 50 and
                round(positive_reviews::numeric / (positive_reviews + negative_reviews) * 100, 1) >= 40
                then 'Mixed'
            when positive_reviews + negative_reviews >= 50 and
                round(positive_reviews::numeric / (positive_reviews + negative_reviews) * 100, 1) < 40
                then 'Mostly Negative'
            else 'Insufficient Reviews'
        end as review_sentiment,
        fetched_at
    from games
)

select * from final